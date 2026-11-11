import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
 plugins:[react()],
 base:'./',
 build:{
  outDir:'../react-live',emptyOutDir:true,assetsDir:'bundles',cssCodeSplit:true,
  rollupOptions:{output:{manualChunks(id){
   if(!id.includes('node_modules'))return;
   if(id.includes('framer-motion')||id.includes('motion-dom')||id.includes('motion-utils'))return 'motion';
   if(id.includes('gsap'))return 'gsap';
   if(id.includes('@supabase')||id.includes('@realtime')||id.includes('@gotrue')||id.includes('@postgrest')||id.includes('@storage'))return 'supabase';
   if(id.includes('react-dom')||id.includes('scheduler')||id.includes('/react/'))return 'react';
  }}}
 },
 server:{port:8127,strictPort:true,host:'127.0.0.1'}
});
