import { useCallback } from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css"
const apiKey = "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"

export default function TextEditor() {
    let isExecuting = false;
    let text = '';
    let responseIndex = 0;
    const wrapperRef = useCallback(wrapper => {
        if (wrapper == null) return;

        wrapper.innerHTML = '';
        const editor = document.createElement('div');
        wrapper.append(editor);
        const quill = new Quill(editor, { theme: "snow" });

        // Adding the generate button



        document.addEventListener("keydown", function (event) {
            if (event.code === "Enter" && event.shiftKey && !isExecuting) {
                isExecuting = true;
                console.log("clicked");
                const prompt = "use the following text below and generate a sentence/paragraph that formulates with the above text , the text can be code also, be creative:" + quill.getText();
                const data = JSON.stringify({
                    model: "text-davinci-003",
                    prompt: prompt,
                    temperature: 0.7,
                    max_tokens: 1500,
                    top_p: 1.0,
                    frequency_penalty: 0.0,
                    presence_penalty: 0.0
                });

                const headers = new Headers({
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`
                });

                fetch("https://api.openai.com/v1/completions", {
                    method: "POST",
                    body: data,
                    headers: headers
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data.choices[0].text);
                        let response = data.choices[0].text;
                        let typeInterval = setInterval(function () {
                            text += response[responseIndex];
                            quill.updateContents([{ insert: text }]);
                            responseIndex++;
                            if (responseIndex === response.length) {
                                clearInterval(typeInterval);
                                isExecuting = false;
                            }

                        }, 50);
                    })

                    .catch(error => {
                        console.log(error);
                        isExecuting = false;
                    });
            }
        });
    }, []);

    return <div className="container" ref={wrapperRef}></div>;
}
