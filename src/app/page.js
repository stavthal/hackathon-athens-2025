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
import { FileText } from "lucide-react";
import axios from "axios";
import { DiffView } from "@hackathon/components/DiffView";

export default function Page() {
  const BASE_URL = "http://51.21.170.254:3000";

  axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
  axios.defaults.headers.common["Content-Type"] = "application/json";

  const [selectedPR, setSelectedPR] = useState(null);
  const [reviewResults, setReviewResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [diff, setDiff] = useState(null);
  const [prs, setPRs] = useState([]);
  const [loading, setLoading] = useState(true);

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
            state: "open",
            user: "john-doe",
            created_at: "2025-01-01T00:00:00Z",
          },
          {
            id: 2,
            title: "Add user validation",
            state: "merged",
            user: "jane-smith",
            created_at: "2025-01-02T00:00:00Z",
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

  const handleAnalyze = async () => {
    if (!selectedPR) return;
    setIsAnalyzing(true);

    try {
      const reviewResponse = await axios.get(
        `${BASE_URL}/generate-review/${selectedPR.id}`
      );
      setFeedback(reviewResponse.data);
      // setReviewResults(mockReviewData);
    } catch (error) {
      setFeedback("<h1>Error loading review</h1>");
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
                onClick={async () => {
                  setSelectedPR(pr);
                  setFeedback(null);
                  try {
                    const diffResponse = await axios.get(
                      `${BASE_URL}/diff/${pr.id}`
                    );
                    setDiff(diffResponse.data);
                  } catch (error) {
                    setDiff(null);
                  }
                }}
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

        {/* Diff & Feedback Center */}
        <div className="flex-1 p-6 flex flex-col gap-4">
          {diff && (
            <Card className="flex-1 pt-3">
              <CardContent className="overflow-y-auto">
                <DiffView diff={diff} />
              </CardContent>
            </Card>
          )}

          {feedback && (
            <Card className="flex-1">
              <CardContent className="overflow-y-auto p-0">
                <div
                  className="prose prose-sm max-w-none p-6 bg-white"
                  dangerouslySetInnerHTML={{ __html: feedback }}
                />
              </CardContent>
            </Card>
          )}

          {!selectedPR && (
            <Card className="h-full">
              <CardContent className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  Select a PR to view diff and analysis
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Review Results & Chat */}
        <div className="w-96 p-6 flex flex-col gap-4 overflow-y-auto">
          <div className="flex-shrink-0">
            {reviewResults && (
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
            )}
          </div>

          <div>
            <ChatBox user_input={feedback} />
          </div>
        </div>
      </div>
    </div>
  );
}
