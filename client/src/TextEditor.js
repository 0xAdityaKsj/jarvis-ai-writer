import { useCallback } from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css"
const config = require('config');
const apiKey = config.get('API_KEY');
export default function TextEditor() {
    const wrapperRef = useCallback(wrapper => {
        if (wrapper == null) return;

        wrapper.innerHTML = '';
        const editor = document.createElement('div');
        wrapper.append(editor);
        const quill = new Quill(editor, { theme: "snow" });

        // Adding the generate button
        const genBtn = document.createElement('button');
        genBtn.innerHTML = 'Generate';
        wrapper.append(genBtn);

        genBtn.addEventListener("click", function () {
            console.log('clicked');
            const prompt = quill.getText();
            const data = JSON.stringify({
                model: 'text-davinci-003',
                prompt: prompt,
                temperature: 0.7,
                max_tokens: 1500,
                top_p: 1.0,
                frequency_penalty: 0.0,
                presence_penalty: 0.0
            });

            const headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            });

            fetch('https://api.openai.com/v1/completions', {
                method: 'POST',
                body: data,
                headers: headers
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data.choices[0].text);
                    quill.insertText(quill.getLength(), data.choices[0].text);
                })
                .catch(error => {
                    console.log(error);
                });
        });
    }, []);

    return <div className="container" ref={wrapperRef}></div>;
}
