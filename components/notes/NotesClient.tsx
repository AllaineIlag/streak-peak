"use client";

import { useState, useMemo } from "react";
import { useNoteStore } from "@/store/useNoteStore";
import { createNote, updateNote, deleteNote } from "@/actions/notes";
import { RichTextEditor } from "@/components/notes/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash, Hash, MoreVertical } from "lucide-react";
import { format } from "date-fns";

export function NotesClient() {
  const { notes, addNote, updateNote: updateStoreNote, removeNote } = useNoteStore();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    notes.forEach((n) => n.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [notes]);

  // Filter notes based on search and tags
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag ? note.tags.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    });
  }, [notes, searchQuery, selectedTag]);

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  const handleCreateNote = async () => {
    const defaultTitle = "Untitled Note";
    const res = await createNote(defaultTitle, null, selectedTag ? [selectedTag] : []);
    
    if (res.data) {
      addNote(res.data);
      setSelectedNoteId(res.data.id);
    }
  };

  const handleUpdateTitle = async (id: string, newTitle: string) => {
    updateStoreNote(id, { title: newTitle });
    await updateNote(id, { title: newTitle });
  };

  const handleUpdateContent = async (id: string, newContent: any) => {
    updateStoreNote(id, { content: newContent });
    await updateNote(id, { content: newContent });
  };

  const handleAddTag = async (id: string, tag: string) => {
    const cleanTag = tag.replace(/^#/, "").trim().toLowerCase();
    if (!cleanTag) return;

    const note = notes.find(n => n.id === id);
    if (!note || note.tags.includes(cleanTag)) return;

    const newTags = [...note.tags, cleanTag];
    updateStoreNote(id, { tags: newTags });
    await updateNote(id, { tags: newTags });
  };

  const handleRemoveTag = async (id: string, tagToRemove: string) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    const newTags = note.tags.filter(t => t !== tagToRemove);
    updateStoreNote(id, { tags: newTags });
    await updateNote(id, { tags: newTags });
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    
    removeNote(id);
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
    await deleteNote(id);
  };

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] overflow-hidden rounded-xl border border-border bg-card">
      {/* Left Sidebar - Note List */}
      <div className="w-80 border-r border-border flex flex-col bg-muted/20">
        <div className="p-4 border-b border-border space-y-4">
          <Button onClick={handleCreateNote} className="w-full justify-start shadow-none" variant="default">
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="pl-9 bg-background shadow-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                  !selectedTag ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-muted"
                }`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-2 py-1 text-xs rounded-full border transition-colors flex items-center ${
                    selectedTag === tag ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-muted"
                  }`}
                >
                  <Hash className="w-3 h-3 mr-0.5 opacity-70" />
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No notes found.
            </div>
          ) : (
            filteredNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors border ${
                  selectedNoteId === note.id 
                    ? "bg-primary/10 border-primary/20" 
                    : "border-transparent hover:bg-muted"
                }`}
              >
                <div className="font-medium truncate">{note.title || "Untitled Note"}</div>
                <div className="text-xs text-muted-foreground mt-1 flex justify-between items-center">
                  <span>{format(new Date(note.updated_at), "MMM d, yyyy")}</span>
                  {note.tags.length > 0 && (
                    <div className="flex gap-1 overflow-hidden">
                      {note.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="bg-background/50 px-1.5 py-0.5 rounded text-[10px]">
                          #{tag}
                        </span>
                      ))}
                      {note.tags.length > 2 && <span className="text-[10px]">+{note.tags.length - 2}</span>}
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Area - Editor */}
      <div className="flex-1 flex flex-col bg-background min-w-0">
        {selectedNote ? (
          <>
            {/* Note Header */}
            <div className="p-6 border-b border-border flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <input
                  type="text"
                  value={selectedNote.title}
                  onChange={(e) => updateStoreNote(selectedNote.id, { title: e.target.value })}
                  onBlur={(e) => handleUpdateTitle(selectedNote.id, e.target.value)}
                  className="text-3xl font-bold bg-transparent border-none outline-none focus:ring-0 w-full placeholder:text-muted-foreground/50"
                  placeholder="Note Title"
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-muted-foreground hover:text-destructive flex-shrink-0"
                  onClick={() => handleDeleteNote(selectedNote.id)}
                  title="Delete Note"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>

              {/* Note Tags Bar */}
              <div className="flex flex-wrap items-center gap-2">
                {selectedNote.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-xs font-medium text-muted-foreground">
                    <Hash className="w-3 h-3" />
                    {tag}
                    <button 
                      onClick={() => handleRemoveTag(selectedNote.id, tag)}
                      className="hover:text-destructive ml-1"
                    >
                      &times;
                    </button>
                  </span>
                ))}
                
                <input 
                  key={`tag-input-${selectedNote.id}`}
                  type="text"
                  placeholder="Add a tag..."
                  className="text-xs bg-transparent border-none outline-none w-24 focus:w-32 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(selectedNote.id, e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto">
                <RichTextEditor 
                  key={selectedNote.id} // Force remount when switching notes
                  initialContent={selectedNote.content} 
                  onUpdate={(content) => handleUpdateContent(selectedNote.id, content)} 
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
            </div>
            <p className="text-lg font-medium">No note selected</p>
            <p className="text-sm mt-1">Select a note from the sidebar or create a new one.</p>
            <Button onClick={handleCreateNote} className="mt-6" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Create Note
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
