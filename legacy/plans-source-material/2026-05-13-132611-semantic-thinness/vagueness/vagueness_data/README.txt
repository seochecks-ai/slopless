We describe the format of vagueness_dataset.json file. The file contains a list of Document objects. Each Document contains a list of Vague_Sentence objects. Both of these objects and attributes are described below: 

Document
    id
    vague_sentences - list of Vague_Sentence objects

Vague_Sentence
    id
    hit_id - Amazon Mechanical Turk ID assigned to the task
    sentence_str - privacy policy sentence shown to the annotator
    vague_phrases - dictionary containing what phrases were identified as vague, and how many annotators identified it
    scores - list of 5 integers from [1-5], representing how vague each of the annotators thought the sentence was

-----------------------------------------------------------------------------------------------------------------------------

The format of the vagueness_dataset.json file is more explicitly described in the following mock JSON below:

{
    ***List of Documents***
    "docs":[
        ***Document 1***
        {
            "id": int,
            "type": "Document",
            "vague_sentences": [

                ***Vague Sentence 1***
                {
                    "id": int,
                    "type": "Sentence",
                    "hit_id": string,
                    "sentence_str": string,

                    ***Word-Level Vagueness***
                    "vague_phrases": {
                        "[vague phrase 1]": int (number of times identified as vague by annotators), 
                        "[vague phrase 2]": int,
                        ...
                    },

                    ***Sentence Vagueness Scores***
                    "scores": [
                        int (Annotator 1's score), 
                        int (Annotator 2's score),
                        int (Annotator 3's score),
                        int (Annotator 4's score),
                        int (Annotator 5's score)
                    ] 
                },

                ***Vague Sentence 2***
                {
                    ...
                }
            ]
        },
        
        ***Document 2***
        {
            ...
        }
    ]
}

-----------------------------------------------------------------------------------------------------------------------------

We now describe the format of the Privacy_Sentences.txt file. This file is derived from the dataset found from Usable Privacy Policy Project website under the name "ACL/COLING 2014 Dataset." The Privacy_Sentences.txt file contains a list of sentences from 1010  Privacy Policy documents. Each Document is separated by two carriage returns ('\n\n'). Each sentence in a single document is separated by a single carriage return ('\n').

The Document id and Sentence id from the vagueness dataset are mapped to the sentences in the Privacy_Sentences.txt file. The Document id is the 0-indexed location in the file. The Sentence id is the 0-indexed line in the ENTIRE file (not the location within the given Document), not including blank lines.

