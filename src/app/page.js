"use client";

import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export default function Page() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [reviewResults, setReviewResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const mockFiles = [
    { id: 1, name: "auth.js", path: "/src/utils/auth.js", status: "pending" },
    { id: 2, name: "api.js", path: "/src/services/api.js", status: "reviewed" },
  ];

  const mockReviewData = {
    score: 85,
    issues: [
      {
        severity: "high",
        line: 23,
        message: "Potential SQL injection vulnerability",
      },
      {
        severity: "medium",
        line: 45,
        message: "Consider memoizing this calculation",
      },
    ],
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setReviewResults(mockReviewData);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">AI Code Review Tool</h1>
          <Button onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? "Analyzing..." : "Run Analysis"}
          </Button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* File List */}
        <div className="w-80 bg-white border-r p-4">
          <h2 className="text-lg font-semibold mb-4">Files</h2>
          {mockFiles.map((file) => (
            <Card
              key={file.id}
              onClick={() => setSelectedFile(file)}
              className={`cursor-pointer mb-2 transition-colors ${
                selectedFile?.id === file.id
                  ? "bg-blue-50 border-blue-200"
                  : "hover:bg-gray-50"
              }`}
            >
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{file.name}</span>
                  <Badge
                    variant={
                      file.status === "reviewed" ? "default" : "secondary"
                    }
                  >
                    {file.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">{file.path}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Code View */}
        <div className="flex-1 p-6">
          {selectedFile ? (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">{selectedFile.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-slate-950 text-slate-100 font-mono text-sm rounded-b-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border-b border-slate-700">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-slate-400">
                      {selectedFile.name}
                    </span>
                  </div>
                  <pre className="p-4 h-96 overflow-auto leading-relaxed">
                    <code className="text-emerald-400">
                      {selectedFile.name === "auth.js"
                        ? `function authenticateUser(username, password) {
  const query = "SELECT * FROM users WHERE username='" + username + "'";
  let hashedPassword = hashPassword(password);
  const result = database.query(query);
  
  if (result.length > 0) {
    const user = result[0];
    if (user.password === hashedPassword) {
      return { success: true, user };
    }
  }
  
  const loginAttempts = calculateLoginAttempts(username);
  return { success: false, attempts: loginAttempts };
}`
                        : `export const fetchUserData = async (userId) => {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};`}
                    </code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full">
              <CardContent className="flex items-center justify-center h-full">
                <p className="text-gray-500">Select a file to view code</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Review Results */}
        <div className="w-96 p-6">
          {reviewResults ? (
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Review Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-blue-600">
                    {reviewResults.score}
                  </div>
                  <div className="text-sm text-gray-500">Overall Score</div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-red-600">Issues</h4>
                  {reviewResults.issues.map((issue, index) => (
                    <Card key={index} className="mb-3 bg-red-50 border-red-200">
                      <CardContent className="p-3">
                        <div className="flex justify-between mb-1">
                          <Badge
                            variant={
                              issue.severity === "high"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {issue.severity}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Line {issue.line}
                          </span>
                        </div>
                        <p className="text-sm">{issue.message}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full">
              <CardContent className="flex items-center justify-center h-full">
                <p className="text-gray-500">Run analysis to see results</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
