// Simple script to copy PNG as ICO (browsers will handle it)
import { copyFileSync } from 'fs';

copyFileSync('public/favicon.png', 'public/favicon.ico');
console.log('✓ Generated favicon.ico');
