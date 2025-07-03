import ChatBox from "@hackathon/components/agent/ChatBox";

export default function AgentPage() {
  // This would typically come from props, state, or be loaded from somewhere
  // For now, it's a placeholder - you can replace this with your actual MD document
  const contextDocument = `# Sample Context Document

This is a sample markdown document that serves as context for the AI agent.

<body data-new-gr-c-s-check-loaded="14.1242.0" data-gr-ext-installed="">
        <h1>Code Review for PR 1</h1>
        <h1>🔍 Code Review: Express API Endpoint Updates</h1>
<h2>📋 Summary of Changes</h2>
<p>This pull request expands the mock data for <code>/users</code> and <code>/products</code> endpoints by adding more sample entries. The changes appear to be for testing or demonstration purposes.</p>
<h2>🧠 Detailed Review</h2>
<h3><strong>GET <code>/users</code> Endpoint Changes</strong></h3>
<pre><code class="language-diff">  app.get('/users', (req, res) =&gt; {
    res.json([
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
-     // Previously 2 users
+     { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
+     { id: 4, name: 'Alice Brown', email: 'alice@example.com' },
+     { id: 5, name: 'Charlie Davis', email: 'charlie@example.com' }
    ]);
  });
</code></pre>
<ul>
<li>✅ Consistent data structure maintained</li>
<li>ℹ️ Increased user dataset from 2 to 5 entries</li>
<li>✅ Unique IDs and realistic mock data</li>
</ul>
<h3><strong>GET <code>/products</code> Endpoint Changes</strong></h3>
<pre><code class="language-diff">  app.get('/products', (req, res) =&gt; {
    res.json([
      { id: 1, name: 'Laptop', price: 999 },
      { id: 2, name: 'Phone', price: 599 },
-     // Previously 2 products
+     { id: 3, name: 'Tablet', price: 399 },
+     { id: 4, name: 'Monitor', price: 699 },
+     { id: 5, name: 'Keyboard', price: 99 }
    ]);
  });
</code></pre>
<ul>
<li>✅ Consistent data structure maintained</li>
<li>ℹ️ Increased product dataset from 2 to 5 entries</li>
<li>✅ Diverse product range with varying prices</li>
</ul>
<h2>🧪 Suggestions &amp; Best Practices</h2>
<ul>
<li>ℹ️ Consider extracting mock data to a separate JSON file for better maintainability</li>
<li>ℹ️ For production, replace mock data with database queries</li>
<li>🧼 Maintain consistent formatting and indentation</li>
</ul>
<h2>📊 Change Statistics</h2>
<table>
<thead>
<tr>
<th>Metric</th>
<th>Count</th>
</tr>
</thead>
<tbody><tr>
<td>➕ Lines Added</td>
<td>6</td>
</tr>
<tr>
<td>➖ Lines Deleted</td>
<td>2</td>
</tr>
</tbody></table>
<h2>🎬 Mock Data Growth</h2>
<p><img src="https://media.giphy.com/media/3o6Zt4HU9uwXmXSAuI/giphy.gif" alt="Data Growth"></p>
<h2>✅ Final Review Summary</h2>
<p>✅ <em>Ready to merge</em></p>

      
      
    </body>
`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Agent Chat
          </h1>
          <p className="text-lg text-gray-600">
            Chat with our AI agent powered by AWS Bedrock
          </p>
        </div>
        <ChatBox user_input={contextDocument} />
      </div>
    </div>
  );
}
