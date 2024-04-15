import backoff
import pandas as pd
import json
import urllib.request
import urllib.error

from langchain_community.tools import tool, ArxivQueryRun, StackExchangeTool, WikipediaQueryRun
from langchain_community.utilities import ArxivAPIWrapper, StackExchangeAPIWrapper, WikipediaAPIWrapper

arxiv = ArxivQueryRun(api_wrapper=ArxivAPIWrapper())
stackexchange = StackExchangeTool(api_wrapper=StackExchangeAPIWrapper())
wikipedia = WikipediaQueryRun(api_wrapper=WikipediaAPIWrapper())