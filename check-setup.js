#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🔍 Coffee Flow - Local Environment Checker\n");

const checks = [];

// Check Node.js version
try {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);
  if (majorVersion >= 18) {
    checks.push({
      name: "Node.js",
      status: "✅",
      details: `${nodeVersion} (OK)`,
    });
  } else {
    checks.push({
      name: "Node.js",
      status: "❌",
      details: `${nodeVersion} (Need 18+)`,
    });
  }
} catch (error) {
  checks.push({ name: "Node.js", status: "❌", details: "Not found" });
}

// Check npm
try {
  const npmVersion = execSync("npm --version", { encoding: "utf8" }).trim();
  checks.push({ name: "npm", status: "✅", details: `v${npmVersion}` });
} catch (error) {
  checks.push({ name: "npm", status: "❌", details: "Not found" });
}

// Check Java
try {
  const javaOutput = execSync("java -version 2>&1", { encoding: "utf8" });
  const javaVersion = javaOutput.match(/version "([^"]+)"/)?.[1] || "Unknown";
  checks.push({ name: "Java", status: "✅", details: `${javaVersion}` });
} catch (error) {
  checks.push({
    name: "Java",
    status: "❌",
    details: "Not found (Need Java 17+)",
  });
}

// Check Maven
try {
  const mavenOutput = execSync("mvn --version", { encoding: "utf8" });
  const mavenVersion =
    mavenOutput.match(/Apache Maven ([^\s]+)/)?.[1] || "Unknown";
  checks.push({ name: "Maven", status: "✅", details: `${mavenVersion}` });
} catch (error) {
  checks.push({
    name: "Maven",
    status: "❌",
    details: "Not found (Need Maven 3.6+)",
  });
}

// Check MySQL
try {
  const mysqlOutput = execSync("mysql --version", { encoding: "utf8" });
  const mysqlVersion =
    mysqlOutput.match(/mysql\s+Ver\s+([^\s]+)/)?.[1] || "Unknown";
  checks.push({ name: "MySQL", status: "✅", details: `${mysqlVersion}` });
} catch (error) {
  checks.push({
    name: "MySQL",
    status: "❌",
    details: "Not found (Need MySQL 8.0+)",
  });
}

// Check project structure
const requiredFiles = [
  "package.json",
  "client/App.tsx",
  "backend/pom.xml",
  "backend/src/main/java/com/coffeeflow/CoffeeFlowApplication.java",
];

requiredFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    checks.push({ name: file, status: "✅", details: "Found" });
  } else {
    checks.push({ name: file, status: "❌", details: "Missing" });
  }
});

// Check ports
function checkPort(port, service) {
  try {
    const result = execSync(
      `netstat -tulpn 2>/dev/null | grep :${port} || echo "free"`,
      { encoding: "utf8" },
    );
    if (result.trim() === "free") {
      checks.push({
        name: `Port ${port} (${service})`,
        status: "✅",
        details: "Available",
      });
    } else {
      checks.push({
        name: `Port ${port} (${service})`,
        status: "⚠️",
        details: "In use",
      });
    }
  } catch (error) {
    checks.push({
      name: `Port ${port} (${service})`,
      status: "?",
      details: "Cannot check",
    });
  }
}

checkPort(5173, "Frontend");
checkPort(8080, "Backend");
checkPort(3306, "MySQL");

// Display results
console.log("Prerequisites:");
checks.forEach((check) => {
  console.log(`${check.status} ${check.name.padEnd(30)} ${check.details}`);
});

// Summary
const failed = checks.filter((c) => c.status === "❌").length;
const warnings = checks.filter((c) => c.status === "⚠️").length;

console.log("\n📊 Summary:");
if (failed === 0 && warnings === 0) {
  console.log("🎉 Everything looks good! You can start development.");
  console.log("\n🚀 Quick Start:");
  console.log("1. npm install");
  console.log("2. cd backend && mvn clean install");
  console.log("3. npm run dev (in one terminal)");
  console.log("4. npm run dev:backend (in another terminal)");
} else {
  if (failed > 0) {
    console.log(`❌ ${failed} required dependencies missing`);
  }
  if (warnings > 0) {
    console.log(`⚠️ ${warnings} potential port conflicts`);
  }
  console.log(
    "\n📚 Check the LOCAL_SETUP.md file for installation instructions.",
  );
}

console.log("\n🔗 Once running:");
console.log("Frontend: http://localhost:5173");
console.log("Backend:  http://localhost:8080/api");
console.log("Login:    tech1/password or admin1/password");
