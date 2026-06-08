fetch('https://onecompiler.com/api/code/exec', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    properties: { 
      language: "cpp", 
      files: [{name: "main.cpp", content: "#include <iostream>\nint main() { int a; std::cin >> a; std::cout << a << std::endl; return 0; }"}],
      stdin: "42"
    }
  })
}).then(r=>r.json()).then(console.log).catch(console.error);
