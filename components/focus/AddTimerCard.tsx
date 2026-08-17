"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTimerStore } from "@/store/useTimerStore";

export function AddTimerCard() {
  const { addPreset } = useTimerStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const [name, setName] = useState("");
  const [rounds, setRounds] = useState("4");
  const [baseFocus, setBaseFocus] = useState("25");
  const [focusChange, setFocusChange] = useState("0");
  const [baseBreak, setBaseBreak] = useState("5");
  const [breakChange, setBreakChange] = useState("0");

  const handleSave = () => {
    if (!name.trim()) return;
    addPreset({
      name,
      rounds: parseInt(rounds) || 4,
      baseFocus: parseInt(baseFocus) || 25,
      focusChange: parseInt(focusChange) || 0,
      baseBreak: parseInt(baseBreak) || 5,
      breakChange: parseInt(breakChange) || 0,
    });
    setIsOpen(false);
    // Reset form
    setName("");
    setRounds("4");
    setBaseFocus("25");
    setFocusChange("0");
    setBaseBreak("5");
    setBreakChange("0");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={
        <button className="flex flex-col items-center justify-center p-6 rounded-3xl border border-dashed hover:border-primary/50 hover:bg-muted/50 transition-all text-muted-foreground hover:text-foreground h-full min-h-[300px]" />
      }>
        <Plus className="h-10 w-10 mb-4" />
        <span className="font-medium text-lg">Add New Timer</span>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Timer</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Preset Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Deep Work" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Number of Rounds (Sessions)</label>
            <Input type="number" min="1" max="20" value={rounds} onChange={(e) => setRounds(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Focus Time (mins)</label>
              <Input type="number" min="1" max="120" value={baseFocus} onChange={(e) => setBaseFocus(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Focus Change/Round</label>
              <div className="flex gap-2">
                <Button 
                  type="button"
                  variant={parseInt(focusChange) < 0 ? "default" : "outline"}
                  onClick={() => setFocusChange("-" + Math.abs(parseInt(focusChange) || 0))}
                  className="px-2"
                >
                  -
                </Button>
                <Input 
                  type="number" 
                  min="0" 
                  max="60" 
                  value={Math.abs(parseInt(focusChange) || 0)} 
                  onChange={(e) => setFocusChange(parseInt(focusChange) < 0 ? "-" + e.target.value : e.target.value)} 
                />
                <Button 
                  type="button"
                  variant={parseInt(focusChange) > 0 ? "default" : "outline"}
                  onClick={() => setFocusChange(Math.abs(parseInt(focusChange) || 0).toString())}
                  className="px-2"
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Break Time (mins)</label>
              <Input type="number" min="1" max="60" value={baseBreak} onChange={(e) => setBaseBreak(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Break Change/Round</label>
              <div className="flex gap-2">
                <Button 
                  type="button"
                  variant={parseInt(breakChange) < 0 ? "default" : "outline"}
                  onClick={() => setBreakChange("-" + Math.abs(parseInt(breakChange) || 0))}
                  className="px-2"
                >
                  -
                </Button>
                <Input 
                  type="number" 
                  min="0" 
                  max="30" 
                  value={Math.abs(parseInt(breakChange) || 0)} 
                  onChange={(e) => setBreakChange(parseInt(breakChange) < 0 ? "-" + e.target.value : e.target.value)} 
                />
                <Button 
                  type="button"
                  variant={parseInt(breakChange) > 0 ? "default" : "outline"}
                  onClick={() => setBreakChange(Math.abs(parseInt(breakChange) || 0).toString())}
                  className="px-2"
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!name.trim()}>Save Preset</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
