from langchain.agents import AgentExecutor, create_react_agent
from langchain_core.globals import set_debug
from langchain_core.prompts import PromptTemplate
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_vertexai import ChatVertexAI

import vertexai

# custom imports
from .tools import arxiv, stackexchange, wikipedia


set_debug(True)

LOCATION = "us-central1"
MODEL_NAME = "gemini-pro"
REACT_PROMPT = PromptTemplate.from_template("""
Assistant is a large language model trained by Google Deepmind.

Assistant is designed to be able to assist with a wide range of tasks, from answering simple questions to providing in-depth explanations and discussions on a wide range of topics. As a language model, Assistant is able to generate human-like text based on the input it receives, allowing it to engage in natural-sounding conversations and provide responses that are coherent and relevant to the topic at hand.

Assistant is constantly learning and improving, and its capabilities are constantly evolving. It is able to process and understand large amounts of text, and can use this knowledge to provide accurate and informative responses to a wide range of questions. Additionally, Assistant is able to generate its own text based on the input it receives, allowing it to engage in discussions and provide explanations and descriptions on a wide range of topics.

Overall, Assistant is a powerful tool that can help with a wide range of tasks and provide valuable insights and information on a wide range of topics. Whether you need help with a specific question or just want to have a conversation about a particular topic, Assistant is here to assist.

TOOLS:
------

Assistant has access to the following tools:

{tools}

To use a tool, please use the following format:

```
Thought: Do I need to use a tool? Yes
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
```

When you have a response to say to the Human, or if you do not need to use a tool, you MUST use the format:

```
Thought: Do I need to use a tool? No
Final Answer: [your response here]
```

Begin!

Previous conversation history:
{chat_history}

New input: {input}
{agent_scratchpad}
""")

class ReActChatAgent:
    def __init__(self, model: str = MODEL_NAME, out_tokens: int = 8192, verbose=True):
        vertexai.init(location=LOCATION)
        llm = ChatVertexAI(model_name=model, temperature=0, max_output_tokens=out_tokens, verbose=verbose)
        tools = [arxiv, stackexchange, wikipedia]
        react_agent = create_react_agent(llm, tools, REACT_PROMPT)
        self.agent = AgentExecutor(agent=react_agent, tools=tools, verbose=verbose)

    @staticmethod
    def _render_chat_history(history) -> str:
        return "\n".join([f"{msg['role']}: {msg['message']}" for msg in history])
        
    def invoke(self, user_prompt: str, image: str = None, chat_history = []):
        return self.agent.invoke({
            "input": user_prompt,
            "chat_history": ReActChatAgent._render_chat_history(chat_history)
        })