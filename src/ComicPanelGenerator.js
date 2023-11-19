import React, { useState } from 'react';
import './ComicPanelGenerator.css';
import axios from 'axios';

const ComicPanelGenerator = () => {
  const [inputTexts, setInputTexts] = useState(Array(10).fill(''));
  const [comicPanels, setComicPanels] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateComicPanels = async () => {
    setLoading(true);
    setComicPanels([]);

    for (let i = 0; i < inputTexts.length; i++) {
      try {
        const response = await axios.post(
          'https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud',
          { inputs: inputTexts[i] },
          {
            headers: {
              Accept: 'image/png',
              Authorization:
                'Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM',
              'Content-Type': 'application/json',
            },
            responseType: 'arraybuffer',
          }
        );

        const uint8Array = new Uint8Array(response.data);
        const base64String = uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), '');
        const imageUrl = `data:image/png;base64,${btoa(base64String)}`;

        setComicPanels((prevPanels) => [...prevPanels, imageUrl]);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    setLoading(false);
  };

  const handleInputChange = (index, value) => {
    const newInputTexts = [...inputTexts];
    newInputTexts[index] = value;
    setInputTexts(newInputTexts);
  };

  return (
    <div className="comic-panel-generator">
      <h1 className="comic-title">Comic Panel Generator</h1>

      <div className="input-container">
        {inputTexts.map((text, index) => (
          <div key={index} className="input-wrapper">
            <input
              type="text"
              value={text}
              placeholder={`Enter text for panel ${index + 1}`}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>

      <button className="generate-button" onClick={generateComicPanels} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Panels'}
      </button>

      {/* Include your spinner element or div with appropriate class here */}

      <div className="comic-panels-container">
        {comicPanels.map((imageUrl, index) => (
          <img key={index} src={imageUrl} alt={`Comic Panel ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default ComicPanelGenerator;