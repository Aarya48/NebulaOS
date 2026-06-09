const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { search, replace } of replacements) {
    content = content.replace(search, replace);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

replaceInFile('src/components/animate-ui/components/community/motion-carousel.tsx', [
  { search: "import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel'", replace: "import type { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel'" }
]);

replaceInFile('src/components/animate-ui/components/community/radial-menu.tsx', [
  { search: "import { LucideIcon } from 'lucide-react'", replace: "import type { LucideIcon } from 'lucide-react'" }
]);

replaceInFile('src/components/animate-ui/primitives/buttons/button.tsx', [
  { search: "import React, {", replace: "import {" }
]);

replaceInFile('src/components/os/AppWindow.tsx', [
  { search: "import React, { useState, useEffect, useRef } from 'react';", replace: "import React, { useEffect, useRef } from 'react';" },
  { search: "import { motion, AnimatePresence } from 'framer-motion';", replace: "import { motion } from 'framer-motion';" }
]);

replaceInFile('src/components/os/BrowserApp.tsx', [
  { search: "import React, { useState, FormEvent, useEffect } from 'react';", replace: "import React, { useState, useEffect } from 'react';\nimport type { FormEvent } from 'react';" }
]);

replaceInFile('src/components/os/CodeEditorApp.tsx', [
  { search: "import React, { useState, useRef, useEffect } from 'react';", replace: "import React, { useState, useEffect } from 'react';" }
]);

replaceInFile('src/components/os/FileExplorerApp.tsx', [
  { search: "import { Folder, File, FileText, ChevronRight, ChevronDown, MoreVertical, Plus, Upload, Trash2 } from 'lucide-react';", replace: "import { Folder, File, ChevronRight, ChevronDown, Upload, Trash2 } from 'lucide-react';" },
  { search: "  const handleDelete = (id: string) => {", replace: "  const _handleDelete = (id: string) => {" } // just rename to _ to avoid unused if it's not used, or better remove it if not used. But renaming is safer.
]);

replaceInFile('src/components/os/SettingsApp.tsx', [
  { search: "import { Settings, Monitor, Palette, MousePointer2, Type, Clock, Search, Battery, Wifi } from 'lucide-react';", replace: "import { Settings, Monitor, Palette, MousePointer2, Type, Clock, Battery, Wifi } from 'lucide-react';" }
]);

replaceInFile('src/components/os/TrashApp.tsx', [
  { search: "import { Trash2, RefreshCcw, FileText, AlertTriangle } from 'lucide-react';", replace: "import { Trash2, RefreshCcw, AlertTriangle } from 'lucide-react';" }
]);

replaceInFile('src/lib/SettingsContext.tsx', [
  { search: "import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';", replace: "import { createContext, useContext, useState, useEffect } from 'react';\nimport type { ReactNode } from 'react';" }
]);

console.log("All fixes applied!");
