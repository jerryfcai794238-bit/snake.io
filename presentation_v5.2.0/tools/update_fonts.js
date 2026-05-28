const fs = require('fs');
let c = fs.readFileSync('presentation_v5.2.0/index.html', 'utf8');

c = c.replace(/<h3 style="font-size: 1\.1rem;/g, '<h3 style="font-size: 1.3rem;');
c = c.replace(/<h3 style="font-size: 1\.15rem;/g, '<h3 style="font-size: 1.3rem;');
c = c.replace(/<h3 style="font-size: 1\.2rem;/g, '<h3 style="font-size: 1.3rem;');
c = c.replace(/<h3 style="font-size: 1\.25rem;/g, '<h3 style="font-size: 1.3rem;');

// Use double quotes for the replacement string to avoid single quote escaping issues
c = c.replace(/<h3 style="font-family: 'Fredoka', sans-serif; font-size: 1\.25rem;/g, "<h3 style=\"font-family: 'Fredoka', sans-serif; font-size: 1.3rem;");

c = c.replace(/<strong style="font-size: 1rem;/g, '<strong style="font-size: 1.3rem;');

c = c.replace(/<p style="font-size: 0\.85rem;/g, '<p style="font-size: 1rem;');
c = c.replace(/<p style="font-size: 0\.8rem;/g, '<p style="font-size: 1rem;');
c = c.replace(/<p style="font-size: 0\.9rem;/g, '<p style="font-size: 1rem;');
c = c.replace(/<p style="font-size: 0\.95rem;/g, '<p style="font-size: 1rem;');

c = c.replace(/<div style="font-size: 0\.85rem;/g, '<div style="font-size: 1rem;');

fs.writeFileSync('presentation_v5.2.0/index.html', c);
console.log('Update complete.');
