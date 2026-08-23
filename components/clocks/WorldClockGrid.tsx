"use client";

import { useEffect, useState } from "react";
import { useClockStore } from "@/store/useClockStore";
import { addTimezone, removeTimezone, getTimezones } from "@/actions/timezones";
import { Button, buttonVariants } from "@/components/ui/button";
import { X, Clock as ClockIcon, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const ALL_TIMEZONES = Intl.supportedValuesOf("timeZone");

export function WorldClockGrid() {
  const { timezones, isHydrated, setInitialData, addTimezone: addOptimistic, removeTimezone: removeOptimistic } = useClockStore();
  const [loading, setLoading] = useState(!isHydrated);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      if (!isHydrated) setLoading(true);
      const data = await getTimezones();
      if (isMounted) {
        setInitialData(data);
        setLoading(false);
      }
    }
    fetchData();
    return () => { isMounted = false; };
  }, [isHydrated, setInitialData]);
  
  const [time, setTime] = useState(new Date());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isHydrated && loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight">World Clocks</h3>
        </div>
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/50" />
        </div>
      </div>
    );
  }

  const handleAdd = async (tz: string) => {
    if (timezones.some((t) => t.timezone === tz)) return;
    
    const tempId = crypto.randomUUID();
    addOptimistic({ id: tempId, user_id: "temp", timezone: tz, created_at: new Date().toISOString() });
    
    const res = await addTimezone(tz);
    if (res.error) {
      removeOptimistic(tempId);
    } else if (res.data) {
      removeOptimistic(tempId);
      addOptimistic(res.data);
    }
  };

  const handleRemove = async (id: string) => {
    const tzToRemove = timezones.find((t) => t.id === id);
    if (!tzToRemove) return;

    removeOptimistic(id);
    const res = await removeTimezone(id);
    if (res.error) {
      addOptimistic(tzToRemove);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-tight">World Clocks</h3>
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger 
            className={buttonVariants({ variant: "outline", className: "w-[250px] justify-between" })}
            role="combobox"
            aria-expanded={open}
          >
            Add Timezone...
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="end">
            <Command>
              <CommandInput placeholder="Search country or city..." />
              <CommandList>
                <CommandEmpty>No timezone found.</CommandEmpty>
                <CommandGroup>
                  {ALL_TIMEZONES.map((tz) => (
                    <CommandItem
                      key={tz}
                      value={tz}
                      onSelect={() => {
                        handleAdd(tz);
                        setOpen(false);
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", timezones.some(t => t.timezone === tz) ? "opacity-100" : "opacity-0")} />
                      {tz.replace(/_/g, " ")}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {timezones.length === 0 && (
          <div className="col-span-full p-8 text-center border border-dashed rounded-xl text-muted-foreground flex flex-col items-center gap-2">
            <ClockIcon className="h-8 w-8 opacity-50" />
            <p>No timezones added yet. Add some to track the time globally!</p>
          </div>
        )}
        
        {timezones.map((tz) => {
          let formattedTime = "";
          let formattedDate = "";
          let offsetStr = "";
          
          try {
            formattedTime = new Intl.DateTimeFormat("en-US", {
              timeZone: tz.timezone,
              hour: "numeric",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            }).format(time);
            
            formattedDate = new Intl.DateTimeFormat("en-US", {
              timeZone: tz.timezone,
              weekday: "short",
              month: "short",
              day: "numeric",
            }).format(time);

            // Calculate offset roughly
            const localDate = new Date();
            const tzDate = new Date(localDate.toLocaleString("en-US", { timeZone: tz.timezone }));
            const diffHours = (tzDate.getTime() - localDate.getTime()) / 1000 / 60 / 60;
            const sign = diffHours >= 0 ? "+" : "";
            offsetStr = `${sign}${Math.round(diffHours)}H`;
          } catch (e) {
            formattedTime = "Invalid Timezone";
          }

          return (
            <div key={tz.id} className="relative group bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <button 
                onClick={() => handleRemove(tz.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="flex flex-col gap-1">
                <div className="text-sm font-medium text-muted-foreground flex justify-between items-center pr-6">
                  <span className="truncate">{tz.timezone.split("/").pop()?.replace(/_/g, " ")}</span>
                  <span className="text-xs opacity-70 border rounded px-1.5 py-0.5">{offsetStr}</span>
                </div>
                <div className="text-3xl font-bold tracking-tight mt-1">{formattedTime.split(" ")[0]} <span className="text-xl font-normal text-muted-foreground">{formattedTime.split(" ")[1]}</span></div>
                <div className="text-sm text-muted-foreground mt-2">{formattedDate}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
