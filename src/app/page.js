"use client";

import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import ChatBox from "../components/agent/ChatBox";
import ReactMarkdown from "react-markdown";
import {
  FileText,
  AlertTriangle,
  DotIcon,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Diff,
} from "lucide-react";
import axios from "axios";
import { Diff2HtmlUI } from "diff2html/lib/ui/js/diff2html-ui.js";
import "diff2html/bundles/css/diff2html.min.css";
import { useRef } from "react";
import { DiffViewer } from "../components/DiffView";

export default function Page() {
  const BASE_URL = "http://51.21.170.254:3000"; // Add your base URL here

  const ref = useRef;
  // Configure axios defaults
  axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
  axios.defaults.headers.common["Content-Type"] = "application/json";

  const [selectedPR, setSelectedPR] = useState(null);
  const [reviewResults, setReviewResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [diff, setDiff] = useState(null);
  const [prs, setPRs] = useState([]);
  const [loading, setLoading] = useState(true);

  const markdown = `# Code Review: Express API Routes Modifications (PR 1)

---

### 🟢 Positive Observations
- Consistent JSON response structure  
- Simple and clear route implementations  
- Added more data points to enhance example datasets  

---

### 🔶 Potential Improvements

#### **Data Management**
- Consider moving hardcoded data to:
  - Separate JSON files  
  - Database configuration  
  - Environment variables  

#### **Error Handling**
- Implement error handling middleware  
- Add status code validation  
- Consider pagination for larger datasets  

#### **Performance**
- For production, replace static data with database queries  
- Implement caching mechanisms for repeated requests  

---

### 🚨 Recommendations
1. Create a separate data layer/service  
2. Add input validation middleware  
3. Implement proper error handling  
4. Use environment configuration for scalability  
5. Consider adding request logging  

---

### 💡 Code Style Notes
- Maintain consistent array length  
- Add comments explaining route purposes  
- Consider using TypeScript for type safety  

---

### 🔍 Security Considerations
- Sanitize user inputs  
- Implement authentication for sensitive routes  
- Use HTTPS for data transmission  

---

### ✅ Overall Rating: Good Starting Point
`;

  useEffect(() => {
    const fetchPRs = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/prs`);
        setPRs(response.data);
      } catch (error) {
        setPRs([
          {
            id: 1,
            title: "Fix authentication bug",
            number: 123,
            author: "john-doe",
            status: "open",
          },
          {
            id: 2,
            title: "Add user validation",
            number: 124,
            author: "jane-smith",
            status: "merged",
          },
          {
            id: 3,
            title: "Update API endpoints",
            number: 125,
            author: "dev-team",
            status: "open",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPRs();
  }, []);

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

  useEffect(() => {
    if (ref.current && diff) {
      const ui = new Diff2HtmlUI(ref.current, diff, {
        drawFileList: true,
        matching: "lines",
        outputFormat: "line-by-line",
      });

      ui.draw();
      ui.highlightCode();
    }
  }, [diff]);

  const handleAnalyze = async () => {
    if (!selectedPR) return;
    setIsAnalyzing(true);

    try {
      const [reviewResponse, diffResponse] = await Promise.all([
        axios.get(`${BASE_URL}/generate-review/${selectedPR.id}`),
        axios.get(`${BASE_URL}/diff/${selectedPR.id}`),
      ]);
      setFeedback(reviewResponse.data);
      setDiff(diffResponse.data);
      // setReviewResults(mockReviewData);
    } catch (error) {
      setFeedback(markdown);
      setDiff(null);
      setReviewResults(mockReviewData);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">AI Code Review Tool</h1>
          <Button onClick={handleAnalyze} disabled={isAnalyzing || !selectedPR}>
            {isAnalyzing ? "Analyzing..." : "Run Analysis"}
          </Button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* PR List */}
        <div className="w-80 bg-white border-r p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Pull Requests</h2>
          {loading ? (
            <div className="text-center py-4 text-gray-500">Loading PRs...</div>
          ) : (
            prs.map((pr) => (
              <Card
                key={pr.id}
                onClick={() => setSelectedPR(pr)}
                className={`mb-2 cursor-pointer transition-colors ${
                  selectedPR?.id === pr.id
                    ? "bg-blue-50 border-blue-200"
                    : "hover:bg-gray-50"
                }`}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm">{pr.title}</span>
                    <Badge
                      variant={pr.state === "merged" ? "default" : "secondary"}
                    >
                      {pr.state}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">#{pr.id}</span>
                    <span className="text-xs text-gray-500">{pr.user}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(pr.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Feedback & Diff Center */}
        <div className="flex-1 p-6 flex flex-col gap-4">
          {feedback ? (
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto max-h-96">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="flex items-center gap-2 text-lg font-bold mb-3">
                          <FileText className="w-4 h-4" />
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="flex items-center gap-2 text-md font-semibold mb-2 mt-4">
                          <CheckCircle className="w-4 h-4" />
                          {children}
                        </h2>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-none space-y-1 mb-3">{children}</ul>
                      ),
                      li: ({ children }) => (
                        <li className="flex items-start gap-2">
                          <DotIcon className="w-5 h-5 mt-1 text-black flex-shrink-0" />
                          <span className="text-sm">{children}</span>
                        </li>
                      ),
                      ol: ({ children }) => (
                        <ol className="space-y-1 mb-3">{children}</ol>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">
                          {children}
                        </strong>
                      ),
                      code: ({ children }) => (
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">
                          {children}
                        </code>
                      ),
                    }}
                  >
                    {feedback}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="flex-1">
              <CardContent className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  Select a PR and run analysis to see feedback
                </p>
              </CardContent>
            </Card>
          )}

          {diff && <DiffViewer diff={diff} className="flex-1" />}
        </div>

        {/* Review Results & Chat */}
        <div className="w-96 p-6 flex flex-col gap-4 overflow-y-auto">
          <div className="flex-shrink-0">
            {reviewResults ? (
              <Card>
                <CardHeader>
                  <CardTitle>Review Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {reviewResults.score}
                    </div>
                    <div className="text-sm text-gray-500">Overall Score</div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-red-600">Issues</h4>
                    {reviewResults.issues.map((issue, index) => (
                      <Card
                        key={index}
                        className="mb-2 bg-red-50 border-red-200"
                      >
                        <CardContent className="p-2">
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
                          <p className="text-xs">{issue.message}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <p className="text-gray-500">Run analysis to see results</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="h-80 flex-shrink-0">
            <ChatBox />
          </div>
        </div>
      </div>
    </div>
  );
}
