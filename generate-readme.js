import fs from "fs";

const history = fs.readFileSync("history.txt", "utf-8").trim().split("\n");

const tableRows = history.map((line, index) => {
    const [member, tanggal] = line.split(" | ");
    return `| ${index + 1} | ${member} | ${tanggal} |`;
});

const markdownTable = `# History Live Showroom JKT48

| No | Member | Tanggal |
|----|--------|---------|
${tableRows.join("\n")}
`;

fs.writeFileSync("README.md", markdownTable);
console.log("README.md berhasil diperbarui!");
