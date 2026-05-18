import pandas as pd
import docx2txt
from PyPDF2 import PdfReader
import markdown as md
import streamlit as st


# TODO:
# Add lemmatization
def extract_text_from_file(uploaded_file):
    # Get file extension
    file_extension = uploaded_file.name.split(".")[-1]

    if file_extension == "txt":
        # Read text file directly
        text = uploaded_file.read().decode("utf-8")
    elif file_extension == "docx":
        # Extract text from docx
        text = docx2txt.process(uploaded_file)
    elif file_extension == "pdf":
        # Extract text from pdf
        pdf_reader = PdfReader(uploaded_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
    else:
        st.error("Invalid file format. Please upload a .txt, .docx, or .pdf file.")
        return None

    return text.lower()


def load_keywords():
    # Read Kobak's et al. (2024) findings
    # url = "https://raw.githubusercontent.com/berenslab/chatgpt-excess-words/main/results/excess_words.csv"
    # My own list of excess words
    url = "https://raw.githubusercontent.com/atsyplenkov/detect-chatgpt/main/data/ges_selected_lemma.csv"
    df = pd.read_csv(url)
    keywords = df.iloc[:, 1].tolist()
    # Add "Utilise", "Utilize", etc.
    additional_keywords = [
        "utilise",
        "utilize",
        "utilising",
        "utilizing",
        "utilised",
        "utilized",
        "utilizes",
        "utilises",
        "leverage",
    ]
    # Remove common words
    common_words = {"https", "github"}
    keywords = [keyword.lower() for keyword in keywords if keyword not in common_words]
    keywords.extend(additional_keywords)

    return keywords


# Read the README.md file and skip the first line
import markdown as md


def readme_to_html():
    with open("README.md", "r") as readme_file:
        readme_lines = []
        for line in readme_file.readlines()[1:]:
            if line.lstrip().startswith("### Acknowledgments"):
                break

            if not line.lstrip().startswith("<img") and not line.lstrip().startswith(
                "[![Streamlit App]"
            ):
                readme_lines.append(line)

        readme_content = "".join(readme_lines)

    # Convert markdown to HTML
    readme_html = md.markdown(readme_content)

    return readme_html
