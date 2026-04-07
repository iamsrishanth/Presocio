import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md
from urllib.parse import urljoin
import time

BASE_URL = "https://json2video.com"
START_PATH = "/docs/v2/api-reference"

visited = set()
urls_to_visit = [START_PATH]
output_file = "JSON2VIDEO_API_README.md"

# Wipe file initially
with open(output_file, 'w', encoding='utf-8') as f:
    f.write("# JSON2VIDEO API Reference Documentation\n\n")

while urls_to_visit:
    current_path = urls_to_visit.pop(0)
    if current_path in visited:
        continue
    
    visited.add(current_path)
    url = urljoin(BASE_URL, current_path)
    print(f"Fetching: {url}")
    
    try:
        response = requests.get(url)
        response.raise_for_status()
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        continue
        
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Extract links if this is the first page to seed our list
    if current_path == START_PATH:
        # usually in a nav or sidebar
        nav = soup.find('nav') or soup.find('aside') or soup
        for a in nav.find_all('a', href=True):
            href = a['href']
            # normalize href
            if href.startswith('http'):
                if not href.startswith(BASE_URL):
                    continue
                href = href.replace(BASE_URL, '')
            
            # Remove trailing slash for comparison
            if href.endswith('/'):
                href = href[:-1]
                
            if href.startswith(START_PATH) and href not in visited and href not in urls_to_visit:
                urls_to_visit.append(href)
    
    # Try to find main content
    # Typical classes/tags for main content: <main>, <article>, div.content, div.prose
    main_content = soup.find('main')
    if not main_content:
        main_content = soup.find('article')
    if not main_content:
        # Fallback to some common main content selectors
        for selector in ['.content', '.markdown-body', '#content', '#main']:
            found = soup.select_one(selector)
            if found:
                main_content = found
                break
                
    if not main_content:
        # Just grab the body minus nav/header/footer
        for tag in ['nav', 'header', 'footer', 'aside']:
            for el in soup.find_all(tag):
                el.decompose()
        main_content = soup.body

    if main_content:
        markdown_content = md(str(main_content), heading_style="ATX")
        with open(output_file, 'a', encoding='utf-8') as f:
            f.write(f"\n\n---\n\n## Content from: {url}\n\n")
            f.write(markdown_content)
    else:
        print(f"Could not find main content for {url}")
        
    time.sleep(0.5)

print("Done scraping!")
