
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';

export default function TestPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [selectedSection, setSelectedSection] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lockedSections, setLockedSections] = useState([]);
  const [pendingSection, setPendingSection] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const questionsPerPage = 2;

  useEffect(() => {
    axios.get('http://localhost:5000/api/questions')
      .then(res => {
        setQuestions(res.data);
        if (res.data.length > 0) {
          setSelectedSection(res.data[0].section);
        }
      });
  }, []);

  // Reset to first page on section change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSection]);

  const sections = [...new Set(questions.map(q => q.section))];
  const filteredQuestions = questions.filter(q => q.section === selectedSection);
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  // Section change handler with confirmation
  const handleSectionChange = (targetSection) => {
    if (targetSection === selectedSection) return;

    if (!lockedSections.includes(selectedSection)) {
      setPendingSection(targetSection);
      setConfirmOpen(true);
    } else {
      setSelectedSection(targetSection);
    }
  };

  const confirmSwitch = () => {
    setLockedSections(prev => [...prev, selectedSection]);
    setSelectedSection(pendingSection);
    setPendingSection('');
    setConfirmOpen(false);
  };

  const cancelSwitch = () => {
    setPendingSection('');
    setConfirmOpen(false);
  };

  const submit = () => {
    let totalScore = 0;
    questions.forEach(q => {
      if (q.correctAnswer === Number(answers[q._id])) {
        totalScore++;
      }
    });
    alert(`Your total score: ${totalScore} / ${questions.length}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Take the Test</h2>

      {/* Section selector with lock */}
      <div style={{ marginBottom: '10px' }}>
        <Select
          value={selectedSection}
          onChange={e => handleSectionChange(e.target.value)}
          displayEmpty
        >
          {sections.map(section => (
            <MenuItem
              key={section}
              value={section}
              disabled={lockedSections.includes(section) && section !== selectedSection}
            >
              {section}
              {lockedSections.includes(section) && section !== selectedSection ? ' (Locked)' : ''}
            </MenuItem>
          ))}
        </Select>
      </div>

      <hr />

      {/* Paginated questions */}
      {currentQuestions.map(q => (
        <div key={q._id} style={{ marginBottom: '10px' }}>
          <p><strong>{q.text}</strong></p>
          {q.options.map((opt, i) => (
            <label key={i} style={{ display: 'block' }}>
              <input
                type="radio"
                name={q._id}
                value={i}
                checked={Number(answers[q._id]) === i}
                onChange={e => setAnswers({ ...answers, [q._id]: e.target.value })}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      {/* Pagination controls */}
      <div style={{ marginTop: '10px' }}>
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          variant="outlined"
        >
          Prev
        </Button>
        <span style={{ margin: '0 10px' }}>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          variant="outlined"
        >
          Next
        </Button>
      </div>

      {/* Submit button */}
      {questions.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <Button onClick={submit} variant="contained" color="primary">
            Submit Test
          </Button>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={cancelSwitch}>
        <DialogTitle>Confirm Switch</DialogTitle>
        <DialogContent>
          Are you sure you want to switch to section <strong>{pendingSection}</strong>?<br />
          You won’t be able to go back to <strong>{selectedSection}</strong>.
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelSwitch}>Cancel</Button>
          <Button onClick={confirmSwitch} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
