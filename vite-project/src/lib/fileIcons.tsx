import { 
  FileText, 
  FileCode2, 
  FileJson, 
  FileImage, 
  FileAudio, 
  FileVideo, 
  FileArchive, 
  FileTerminal,
  FilePenLine
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface FileIconData {
  icon: LucideIcon;
  colorClass: string;
  glowClass: string;
}

export function getFileIconData(filename: string): FileIconData {
  const extension = filename.split('.').pop()?.toLowerCase();

  switch (extension) {
    // JavaScript & TypeScript
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return { 
        icon: FileCode2, 
        colorClass: 'text-yellow-400', 
        glowClass: 'drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]' 
      };

    // C++ and similar
    case 'cpp':
    case 'c':
    case 'cs':
    case 'h':
    case 'hpp':
      return { 
        icon: FileCode2, 
        colorClass: 'text-blue-500', 
        glowClass: 'drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
      };

    // Python
    case 'py':
    case 'pyc':
      return { 
        icon: FileCode2, 
        colorClass: 'text-green-500', 
        glowClass: 'drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]' 
      };

    // Web
    case 'html':
    case 'css':
      return { 
        icon: FileCode2, 
        colorClass: 'text-orange-500', 
        glowClass: 'drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]' 
      };

    // Data / Config
    case 'json':
      return { 
        icon: FileJson, 
        colorClass: 'text-yellow-300', 
        glowClass: 'drop-shadow-[0_0_10px_rgba(253,224,71,0.3)]' 
      };
    case 'csv':
    case 'xlsx':
      return { 
        icon: FileSpreadsheet, 
        colorClass: 'text-emerald-500', 
        glowClass: 'drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
      };
    case 'yaml':
    case 'yml':
    case 'env':
      return { 
        icon: FileTerminal, 
        colorClass: 'text-gray-400', 
        glowClass: 'drop-shadow-[0_0_10px_rgba(156,163,175,0.3)]' 
      };

    // Media
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
    case 'webp':
      return { 
        icon: FileImage, 
        colorClass: 'text-purple-400', 
        glowClass: 'drop-shadow-[0_0_10px_rgba(192,132,252,0.3)]' 
      };
    case 'mp3':
    case 'wav':
    case 'ogg':
      return { 
        icon: FileAudio, 
        colorClass: 'text-pink-400', 
        glowClass: 'drop-shadow-[0_0_10px_rgba(244,114,182,0.3)]' 
      };
    case 'mp4':
    case 'mkv':
    case 'webm':
      return { 
        icon: FileVideo, 
        colorClass: 'text-rose-500', 
        glowClass: 'drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]' 
      };

    // Archives
    case 'zip':
    case 'rar':
    case 'tar':
    case 'gz':
    case '7z':
      return { 
        icon: FileArchive, 
        colorClass: 'text-amber-600', 
        glowClass: 'drop-shadow-[0_0_10px_rgba(217,119,6,0.3)]' 
      };

    // Docs
    case 'md':
      return { 
        icon: FilePenLine, 
        colorClass: 'text-blue-300', 
        glowClass: 'drop-shadow-[0_0_10px_rgba(147,197,253,0.3)]' 
      };
    case 'txt':
    default:
      return { 
        icon: FileText, 
        colorClass: 'text-gray-300', 
        glowClass: 'drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]' 
      };
  }
}
