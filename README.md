<h1>Talk Wave Chat App Server</h1><p>Welcome to the <code>Talk Wave</code> chat server, a Node.js server that powers the <code>Talk Wave</code> group chat application. This server manages user authentication, channels, messages, and real-time socket events.</p><h2>Features</h2><ul><li>Group chat rooms.</li><li>Private chat rooms that require an access key to join.</li><li>Real-time message broadcasting with sockets.</li></ul><h2>Installation</h2><ol><li><p>Clone this repository:</p><pre><div class="bg-black rounded-md mb-4"><div class="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md"></div><div class="p-4 overflow-y-auto"><code class="!whitespace-pre hljs language-bash">git <span class="hljs-built_in">clone</span> https://github.com/suhy-jang/talk_wave_server.git
</code></div></div></pre></li><li><p>Change your working directory:</p><pre><div class="bg-black rounded-md mb-4"><div class="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md"></div><div class="p-4 overflow-y-auto"><code class="!whitespace-pre hljs language-bash"><span class="hljs-built_in">cd</span> talk_wave_server
</code></div></div></pre></li><li><p>Install the necessary dependencies:</p><pre><div class="bg-black rounded-md mb-4"><div class="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md"></div><div class="p-4 overflow-y-auto"><code class="!whitespace-pre hljs language-bash">npm install
</code></div></div></pre></li><li><p>Create a <code>config/.env.development</code> file and fill out the following fields:</p><pre><div class="bg-black rounded-md mb-4"><div class="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md"></div><div class="p-4 overflow-y-auto">
JWT_SECRET=&lt;Your JWT Secret Key&gt;
REDIS_SECRET=&lt;Your Redis Secret Key&gt;
REDIS_URL=&lt;Local or Remote Redis URL&gt;
CLIENT_ORIGIN=http://localhost:3000
MONGODB_URI=&lt;Local or Remote MongoDB URI&gt;
</div></div></pre></li></ol><ul><li><code>JWT_SECRET</code> and <code>REDIS_SECRET</code>: These can be any string you prefer. They will be used for encryption and session management.</li><li><code>REDIS_URL</code> and <code>MONGODB_URI</code>: After installing Redis and MongoDB locally or setting them up remotely, provide the connection URLs here.</li></ul><ol start="5"><li>Start the server on port 4000:<pre><div class="bg-black rounded-md mb-4"><div class="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md"></div><div class="p-4 overflow-y-auto"><code class="!whitespace-pre hljs language-bash">npm start
</code></div></div></pre></li></ol><h2>API Endpoints</h2><h3>Authentication</h3><ul><li><strong>POST</strong> <code>/auth/signup</code>: Sign up a new user.</li><li><strong>POST</strong> <code>/auth/login</code>: Log in an existing user.</li><li><strong>POST</strong> <code>/auth/verify</code>: Verify an authenticated user.</li></ul><h3>Channels</h3><ul><li><strong>GET</strong> <code>/channel</code>: Retrieve a list of channels.</li><li><strong>POST</strong> <code>/channel</code>: Create a new channel.</li><li><strong>POST</strong> <code>/channel/verify</code>: Verify access to a private channel.</li></ul><h3>Messages</h3><ul><li><strong>GET</strong> <code>/message/:channelId</code>: Retrieve messages for a given channel.</li></ul><h3>Subscriptions</h3><ul><li><strong>GET</strong> <code>/privateSubscription/users/:channel</code>: Retrieve users in a private subscription.</li></ul><h2>Socket Events</h2><h3>Channel Events</h3><ul><li><strong>on</strong> <code>joinChannel</code>: Join a specific channel.</li><li><strong>on</strong> <code>leaveChannel</code>: Leave a specific channel.</li></ul><h3>Message Events</h3><ul><li><strong>on</strong> <code>typing</code>: A user starts typing a message.</li><li><strong>on</strong> <code>stopTyping</code>: A user stops typing a message.</li><li><strong>on</strong> <code>sendMessage</code>: Send a message to the server.</li></ul><h3>Miscellaneous</h3><ul><li><strong>on</strong> <code>disconnect</code>: A user disconnects from the server.</li><li><strong>on</strong> <code>syncSubscriptions</code>: Sync user subscriptions.</li></ul><h3>Client Emits</h3><ul><li><strong>emit</strong> <code>userTyping</code>: Notify the server when a user starts typing.</li><li><strong>emit</strong> <code>userStoppedTyping</code>: Notify the server when a user stops typing.</li><li><strong>emit</strong> <code>receiveMessage</code>: A user receives a message.</li><li><strong>emit</strong> <code>userLeft</code>: A user leaves the chat.</li><li><strong>emit</strong> <code>userJoined</code>: A new user joins the chat.</li><li><strong>emit</strong> <code>subscribers</code>: Retrieve the list of subscribers for a room.</li></ul><h2>License</h2><p>This project is licensed under the MIT License. Check out the <a href="LICENSE" target="_new">LICENSE</a> for more details.</p>