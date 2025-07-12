import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function TestPage() {
  const { section } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/api/questions')
      .then(res => setQuestions(res.data.filter(q => q.section === section)));
  }, [section]);

  const submit = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (q.correctAnswer === Number(answers[q._id])) score++;
    });
    alert(`Your score: ${score}/${questions.length}`);
  };

  return (
    <div>
      <h2>{section} Test</h2>
      {questions.map((q, idx) => (
        <div key={q._id}>
          <p>{q.text}</p>
          {q.options.map((opt, i) => (
            <label key={i}>
              <input type="radio"
                name={q._id}
                value={i}
                onChange={e => setAnswers({...answers, [q._id]: e.target.value})}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button onClick={submit}>Submit</button>
    </div>
  );
}
