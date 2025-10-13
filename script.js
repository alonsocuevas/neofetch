const terminalContent = document.getElementById('terminal-content');
let currentTextIndex = 0;
let lineDelay = 400; // Retraso entre cada línea (en milisegundos)

// 🚀 DATOS PARA LA "COMPILACIÓN"
const fullTextLines = [
    { type: 'command', text: 'alonso@alonso:~$ neofetch' },
    { type: 'output', text: '[INFO] Recuperando informacion del sistema...' },
    { type: 'output', text: '' },
    
    // Nombre en un elemento HTML para aplicar el estilo Pixel Art
    { type: 'raw', html: `<span class="name-pixel">ALONSO CUEVAS</span>` },
    { type: 'raw', html: `<span class="name-pixel">PIZARRO</span>` },

    { type: 'output', text: '> Desarrollador Web Full Stack' },
    { type: 'output', text: '> Ingeniero en Informática' },
    { type: 'output', text: '> Ubicacion: Chile' },
    { type: 'output', text: '' },

    { type: 'separator', text: '------ TECNOLOGÍAS ------' },

   // { type: 'command', text: 'user@alonso-pc:~$ ls -l /skills/core' },
    
    // LENGUAJES Y FRAMEWORKS
{ type: 'output', text: `<span class="icon fab fa-js" style="color:#f1e05a;"></span> JavaScript / <span class="icon fab fa-python" style="color:#3572A5;"></span> Python` },
   
// Next.js: Usamos la clase de Devicon para el logo oficial
{ type: 'output', text: `<span class="icon fab fa-react" style="color:#61DAFB;"></span> React / <span class="icon devicon-nextjs-original colored" style="color:#ffffff;"></span> Next.js` }, 
{ type: 'output', text: `<span class="icon fab fa-html5" style="color:#E34F26;"></span> HTML / <span class="icon fab fa-css3-alt" style="color:#1572B6;"></span> CSS` },

// PostgreSQL y MySQL: Usamos las clases oficiales de Devicon
{ type: 'output', text: `<span class="icon fab fa-node-js" style="color:#339933;"></span> Node.js / <span class="icon devicon-postgresql-plain colored" style="color:#4169E1;"></span> PostgreSQL / <span class="icon devicon-mysql-plain colored" style="color:#4479A1;"></span> MySQL` }, 
// Prisma ORM: Devicon no tiene logo oficial, ¡pero Simple Icons sí! Usaremos el logo Unicode de diamante con el color oficial (es lo más cercano a lo "correcto")
{ type: 'output', text: `<span class="icon">💎</span> Prisma ORM` }, // El diamante Unicode o el logo de Prisma SVG es la única opción
{ type: 'output', text: '' },
   
// HERRAMIENTAS Y DEVOPS
// VS CODE: Usamos la clase oficial de Devicon
{ type: 'output', text: `<span class="icon fab fa-docker" style="color:#2496ED;"></span> Docker / <span class="icon devicon-vscode-plain colored" style="color:#007ACC;"></span> VS Code` }, 
{ type: 'output', text: `<span class="icon fab fa-git-alt" style="color:#F05032;"></span> Git / <span class="icon fab fa-github" style="color:#ffffff;"></span> GitHub` },
{ type: 'output', text: `<span class="icon fab fa-aws" style="color:#FF9900;"></span> AWS / <span class="icon fas fa-terminal" style="color:#50fa7b;"></span> BASH` },

    { type: 'output', text: '' },
     { type: 'separator', text: '------ CONTACTO -------' },
    { type: 'output', text: `<span class="icon fab fa-whatsapp" style="color:#25D366;"></span> +56 932207318` },
    
    { type: 'output', text: `<span class="icon fas fa-globe" style="color:#ffb86c;"></span> https://alonsocuevas.github.io/dev/` },

    { type: 'output', text: `<span class="icon fab fa-github" style="color:#ffffff;"></span> https://github.com/alonsocuevas` },
    
    { type: 'output', text: '' },
    { type: 'separator', text: `---- May The Force Be With You ----` },
    { type: 'command', text: 'alonso@alonso:~$ ' },
];

// Función principal para la animación de escritura
function typeLine(lineData, isLastLine = false) {
    return new Promise(resolve => {
        const lineElement = document.createElement('div');
        let content = lineData.text || '';
        
        // Si es HTML crudo (como el nombre), lo insertamos directamente
        if (lineData.type === 'raw') {
            lineElement.innerHTML = lineData.html;
            terminalContent.appendChild(lineElement);
            return resolve();
        }

        // Asignar clase de color
        lineElement.className = `line-${lineData.type}`;
        
        // Reemplazar iconos/símbolos si están definidos dentro del texto
        content = content.replace(/<span class="icon"[^>]*>.*?<\/span>/g, (match) => {
            // Mantenemos el HTML del icono para que se renderice correctamente
            return match;
        });
        
        terminalContent.appendChild(lineElement);

        let charIndex = 0;
        let buffer = '';
        const speed = 1; // Velocidad de escritura (ms por caracter)

        // Crear el cursor al final de la línea
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        lineElement.appendChild(cursor);

        // Función para escribir un caracter
        function writeChar() {
            if (charIndex < content.length) {
                // Si el siguiente carácter es el inicio de un span (icono)
                if (content.substring(charIndex).startsWith('<span')) {
                    const spanEnd = content.indexOf('</span>', charIndex) + 7;
                    buffer += content.substring(charIndex, spanEnd);
                    charIndex = spanEnd;
                } else {
                    buffer += content.charAt(charIndex);
                    charIndex++;
                }
                
                lineElement.innerHTML = buffer;
                lineElement.appendChild(cursor); // Mantenemos el cursor al final
                
                requestAnimationFrame(() => setTimeout(writeChar, speed));
            } else {
                // Terminado, resolvemos la promesa
                // Si no es la última línea, quitamos el cursor
                if (!isLastLine) {
                    lineElement.removeChild(cursor);
                }
                resolve();
            }
        }
        
        writeChar();
    });
}

// Función para procesar todas las líneas
async function runCompilation() {
    for (let i = 0; i < fullTextLines.length; i++) {
        const lineData = fullTextLines[i];
        const isLastLine = i === fullTextLines.length - 1;

        // Hacemos que se escriba la línea y esperamos a que termine
        await typeLine(lineData, isLastLine); 
        
        // Hacemos que la pantalla se desplace automáticamente hacia abajo
        terminalContent.scrollTop = terminalContent.scrollHeight;

        // Esperamos el retraso entre líneas, excepto para la última
        if (!isLastLine) {
            await new Promise(resolve => setTimeout(resolve, lineDelay));
        }
    }
}

// Iniciar la animación
// Nota: Este llamado debe estar fuera de cualquier evento de carga para funcionar, 
// o envuelto en un 'DOMContentLoaded' si se quiere mayor robustez, aunque la posición
// al final del body en el HTML ya lo resuelve.
runCompilation();