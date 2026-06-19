import { Link } from "wouter";
import { Channel } from "@/lib/channels";
import { Play } from "lucide-react";

interface ChannelRowProps {
  channel: Channel;
  index: number;
  watchHref?: string;
}

export default function ChannelRow({ channel, index, watchHref }: ChannelRowProps) {
  const is1080p = channel.name.toLowerCase().includes("1080p");
  const is720p = channel.name.toLowerCase().includes("720p");
  const isHD = channel.name.toLowerCase().includes("hd");
  
  let qualityBadge = null;
  if (is1080p) qualityBadge = "1080p";
  else if (is720p) qualityBadge = "720p";
  else if (isHD) qualityBadge = "HD";

  return (
    <Link href={watchHref || `/watch/${channel.id}`}>
      <div
        className="group flex items-center justify-between rounded-lg border border-cyan-500/20 bg-[#0a0a0a] p-4 transition-all duration-300 hover:border-cyan-500/60 hover:bg-[#1a1a1a] hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] animate-fade-in-up"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex items-center gap-4">
          <span className="text-xl">{channel.countryFlag}</span>
          <span className="font-medium tracking-wide text-white group-hover:text-cyan-400 transition-colors">
            {channel.name}
          </span>
          {qualityBadge && (
            <span className="hidden sm:inline-flex rounded border border-cyan-500/40 bg-cyan-950/30 px-2 py-0.5 text-xs font-bold text-cyan-400">
              {qualityBadge}
            </span>
          )}
        </div>
        <div className="flex items-center justify-center h-10 w-10 rounded-full border border-cyan-500/30 bg-black text-cyan-500 transition-all group-hover:border-cyan-400 group-hover:bg-cyan-500/10 group-hover:shadow-[0_0_10px_rgba(0,229,255,0.5)]">
          <Play className="h-4 w-4 ml-1" />
        </div>
      </div>
    </Link>
  );
}
