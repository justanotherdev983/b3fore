"use client"

interface CustomSyntaxHighlighterProps {
  code: string
  language: string
}

export function CustomSyntaxHighlighter({ code, language }: CustomSyntaxHighlighterProps) {
  const highlightCode = (code: string, lang: string) => {
    const lines = code.split("\n")

    return lines.map((line, lineIndex) => {
      const highlightedLine = line

      // Common patterns across languages
      const patterns = {
        // Comments
        comment: {
          regex: /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/g,
          className: "text-[#565f89] italic",
        },
        // Strings
        string: {
          regex: /(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g,
          className: "text-[#9ece6a]",
        },
        // Numbers
        number: {
          regex: /\b(\d+\.?\d*)\b/g,
          className: "text-[#ff9e64]",
        },
        // Keywords (language specific)
        keyword: {
          regex: getKeywordRegex(lang),
          className: "text-[#bb9af7] font-medium",
        },
        // Functions
        function: {
          regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
          className: "text-[#7aa2f7]",
        },
        // Types (for TypeScript, etc.)
        type: {
          regex: /\b(string|number|boolean|object|Array|Promise|void|null|undefined|any)\b/g,
          className: "text-[#2ac3de]",
        },
        // Operators
        operator: {
          regex: /[+\-*/%=<>!&|^~?:]/g,
          className: "text-[#89ddff]",
        },
      }

      // Apply highlighting patterns
      const tokens = []
      let lastIndex = 0
      const allMatches = []

      // Collect all matches
      Object.entries(patterns).forEach(([type, pattern]) => {
        if (pattern.regex) {
          let match
          const regex = new RegExp(pattern.regex.source, pattern.regex.flags)
          while ((match = regex.exec(line)) !== null) {
            allMatches.push({
              type,
              start: match.index,
              end: match.index + match[0].length,
              text: match[0],
              className: pattern.className,
            })
          }
        }
      })

      // Sort matches by position
      allMatches.sort((a, b) => a.start - b.start)

      // Remove overlapping matches (keep first one)
      const filteredMatches = []
      allMatches.forEach((match) => {
        const overlaps = filteredMatches.some(
          (existing) =>
            (match.start >= existing.start && match.start < existing.end) ||
            (match.end > existing.start && match.end <= existing.end),
        )
        if (!overlaps) {
          filteredMatches.push(match)
        }
      })

      // Build tokens
      filteredMatches.forEach((match, i) => {
        // Add text before match
        if (match.start > lastIndex) {
          tokens.push(
            <span key={`text-${i}`} className="text-[#c0caf5]">
              {line.slice(lastIndex, match.start)}
            </span>,
          )
        }

        // Add highlighted match
        tokens.push(
          <span key={`match-${i}`} className={match.className}>
            {match.text}
          </span>,
        )

        lastIndex = match.end
      })

      // Add remaining text
      if (lastIndex < line.length) {
        tokens.push(
          <span key="remaining" className="text-[#c0caf5]">
            {line.slice(lastIndex)}
          </span>,
        )
      }

      return (
        <div key={lineIndex} className="flex">
          <span className="text-[#565f89] text-right w-8 pr-2 select-none flex-shrink-0 text-sm">{lineIndex + 1}</span>
          <span className="flex-1 pl-2">
            {tokens.length > 0 ? tokens : <span className="text-[#c0caf5]">{line}</span>}
          </span>
        </div>
      )
    })
  }

  function getKeywordRegex(language: string) {
    const keywords = {
      javascript: [
        "const",
        "let",
        "var",
        "function",
        "return",
        "if",
        "else",
        "for",
        "while",
        "do",
        "switch",
        "case",
        "break",
        "continue",
        "try",
        "catch",
        "finally",
        "throw",
        "new",
        "this",
        "typeof",
        "instanceof",
        "in",
        "of",
        "async",
        "await",
        "class",
        "extends",
        "super",
        "static",
        "import",
        "export",
        "from",
        "default",
      ],
      typescript: [
        "const",
        "let",
        "var",
        "function",
        "return",
        "if",
        "else",
        "for",
        "while",
        "do",
        "switch",
        "case",
        "break",
        "continue",
        "try",
        "catch",
        "finally",
        "throw",
        "new",
        "this",
        "typeof",
        "instanceof",
        "in",
        "of",
        "async",
        "await",
        "class",
        "extends",
        "super",
        "static",
        "import",
        "export",
        "from",
        "default",
        "interface",
        "type",
        "enum",
        "namespace",
        "declare",
        "abstract",
        "implements",
        "private",
        "protected",
        "public",
        "readonly",
      ],
      python: [
        "def",
        "class",
        "if",
        "elif",
        "else",
        "for",
        "while",
        "try",
        "except",
        "finally",
        "with",
        "as",
        "import",
        "from",
        "return",
        "yield",
        "lambda",
        "and",
        "or",
        "not",
        "in",
        "is",
        "None",
        "True",
        "False",
        "pass",
        "break",
        "continue",
        "global",
        "nonlocal",
        "async",
        "await",
      ],
      bash: [
        "if",
        "then",
        "else",
        "elif",
        "fi",
        "for",
        "while",
        "do",
        "done",
        "case",
        "esac",
        "function",
        "return",
        "exit",
        "export",
        "source",
        "alias",
        "echo",
        "cd",
        "ls",
        "grep",
        "awk",
        "sed",
      ],
      css: ["@media", "@import", "@keyframes", "@font-face", "important", "inherit", "initial", "unset"],
      html: [
        "DOCTYPE",
        "html",
        "head",
        "body",
        "title",
        "meta",
        "link",
        "script",
        "style",
        "div",
        "span",
        "p",
        "a",
        "img",
        "ul",
        "ol",
        "li",
        "table",
        "tr",
        "td",
        "th",
      ],
      json: ["true", "false", "null"],
    }

    const langKeywords = keywords[language as keyof typeof keywords] || keywords.javascript
    return new RegExp(`\\b(${langKeywords.join("|")})\\b`, "g")
  }

  return (
    <pre className="p-4 text-sm font-mono overflow-x-auto">
      <code>{highlightCode(code, language)}</code>
    </pre>
  )
}
