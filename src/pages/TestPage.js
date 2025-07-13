
// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import {
// //   Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControlLabel, Radio, Checkbox
// // } from '@mui/material';

// // export default function TestPage() {
// //   const [questions, setQuestions] = useState([]);
// //   const [answers, setAnswers] = useState({});
// //   const [selectedSection, setSelectedSection] = useState('');
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [lockedSections, setLockedSections] = useState([]);
// //   const [pendingSection, setPendingSection] = useState('');
// //   const [confirmOpen, setConfirmOpen] = useState(false);
// //   const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 min per section

// //   const questionsPerPage = 2;

// //   useEffect(() => {
// //     axios.get('http://localhost:5000/api/questions')
// //       .then(res => {
// //         setQuestions(res.data);
// //         if (res.data.length > 0) {
// //           setSelectedSection(res.data[0].section);
// //         }
// //       });
// //   }, []);

// //   // Reset page and timer on section change
// //   useEffect(() => {
// //     setCurrentPage(1);
// //     setTimeLeft(30 * 60);
// //   }, [selectedSection]);

// //   // Timer countdown
// //   useEffect(() => {
// //     const timer = setInterval(() => {
// //       setTimeLeft(prev => {
// //         if (prev <= 1) {
// //           lockCurrentSection();
// //           return 0;
// //         }
// //         return prev - 1;
// //       });
// //     }, 1000);
// //     return () => clearInterval(timer);
// //   }, [selectedSection]);

// //   const sections = [...new Set(questions.map(q => q.section))];
// //   const filteredQuestions = questions.filter(q => q.section === selectedSection);
// //   const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
// //   const indexOfLastQuestion = currentPage * questionsPerPage;
// //   const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
// //   const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

// //   // Lock section when time ends or on switch
// //   const lockCurrentSection = () => {
// //     setLockedSections(prev => [...new Set([...prev, selectedSection])]);
// //   };

// //   const handleSectionChange = (targetSection) => {
// //     if (targetSection === selectedSection) return;
// //     if (!lockedSections.includes(selectedSection)) {
// //       setPendingSection(targetSection);
// //       setConfirmOpen(true);
// //     } else {
// //       setSelectedSection(targetSection);
// //     }
// //   };

// //   const confirmSwitch = () => {
// //     lockCurrentSection();
// //     setSelectedSection(pendingSection);
// //     setPendingSection('');
// //     setConfirmOpen(false);
// //   };

// //   const cancelSwitch = () => {
// //     setPendingSection('');
// //     setConfirmOpen(false);
// //   };

// //   const toggleOption = (qid, optionIdx) => {
// //     const current = answers[qid] || [];
// //     if (current.includes(optionIdx)) {
// //       setAnswers({ ...answers, [qid]: current.filter(i => i !== optionIdx) });
// //     } else {
// //       setAnswers({ ...answers, [qid]: [...current, optionIdx] });
// //     }
// //   };

// //   const toggleSelectAll = (q) => {
// //     if ((answers[q._id]?.length || 0) === q.options.length) {
// //       setAnswers({ ...answers, [q._id]: [] });
// //     } else {
// //       setAnswers({ ...answers, [q._id]: q.options.map((_, i) => i) });
// //     }
// //   };

// //   const submit = () => {
// //     let totalScore = 0;
// //     questions.forEach(q => {
// //       if (q.type === 'single') {
// //         if (q.correctAnswer === Number(answers[q._id])) totalScore++;
// //       } else if (q.type === 'multiple') {
// //         const selected = answers[q._id] || [];
// //         if (arraysEqual(selected.sort(), q.correctAnswer.sort())) totalScore++;
// //       }
// //     });
// //     alert(`Your total score: ${totalScore} / ${questions.length}`);
// //   };

// //   const arraysEqual = (a, b) =>
// //     a.length === b.length && a.every((v, i) => v === b[i]);

// //   const formatTime = () => {
// //     const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
// //     const s = (timeLeft % 60).toString().padStart(2, '0');
// //     return `${m}:${s}`;
// //   };

// //   return (
// //     <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
// //       <h2>Online Test</h2>
// //       <p><strong>Section:</strong> {selectedSection} &nbsp; | &nbsp; <strong>Time Left:</strong> {formatTime()}</p>

// //       {/* Section Selector */}
// //       <div style={{ marginBottom: '10px' }}>
// //         <Select value={selectedSection} onChange={e => handleSectionChange(e.target.value)}>
// //           {sections.map(section => (
// //             <MenuItem
// //               key={section}
// //               value={section}
// //               disabled={lockedSections.includes(section) && section !== selectedSection}
// //             >
// //               {section} {lockedSections.includes(section) && section !== selectedSection ? '(Locked)' : ''}
// //             </MenuItem>
// //           ))}
// //         </Select>
// //       </div>

// //       {/* Questions */}
// //       {currentQuestions.map((q, idx) => (
// //         <div key={q._id} style={{ marginBottom: '15px' }}>
// //           <p><strong>Q{indexOfFirstQuestion + idx + 1}:</strong> {q.text}</p>
// //           {q.type === 'multiple' && (
// //             <FormControlLabel
// //               control={
// //                 <Checkbox
// //                   checked={(answers[q._id]?.length || 0) === q.options.length}
// //                   onChange={() => toggleSelectAll(q)}
// //                 />
// //               }
// //               label="Select All"
// //             />
// //           )}
// //           {q.options.map((opt, i) => (
// //             <FormControlLabel
// //               key={i}
// //               control={
// //                 q.type === 'single' ? (
// //                   <Radio
// //                     checked={Number(answers[q._id]) === i}
// //                     onChange={() => setAnswers({ ...answers, [q._id]: i })}
// //                   />
// //                 ) : (
// //                   <Checkbox
// //                     checked={answers[q._id]?.includes(i) || false}
// //                     onChange={() => toggleOption(q._id, i)}
// //                   />
// //                 )
// //               }
// //               label={opt}
// //               style={{ display: 'block' }}
// //             />
// //           ))}
// //         </div>
// //       ))}

// //       {/* Pagination */}
// //       <div style={{ marginTop: '10px' }}>
// //         <Button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} variant="outlined">Prev</Button>
// //         <span style={{ margin: '0 10px' }}>Page {currentPage} of {totalPages}</span>
// //         <Button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} variant="outlined">Next</Button>
// //       </div>

// //       {/* Submit */}
// //       <div style={{ marginTop: '20px' }}>
// //         <Button onClick={submit} variant="contained" color="primary">Submit Test</Button>
// //       </div>

// //       {/* Confirm Dialog */}
// //       <Dialog open={confirmOpen} onClose={cancelSwitch}>
// //         <DialogTitle>Switch Section</DialogTitle>
// //         <DialogContent>
// //           You won't be able to return to section <strong>{selectedSection}</strong>. Continue to <strong>{pendingSection}</strong>?
// //         </DialogContent>
// //         <DialogActions>
// //           <Button onClick={cancelSwitch}>Cancel</Button>
// //           <Button onClick={confirmSwitch} color="primary" variant="contained">Confirm</Button>
// //         </DialogActions>
// //       </Dialog>
// //     </div>
// //   );
// // }


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControlLabel, Radio, Checkbox
// } from '@mui/material';

// export default function TestPage() {
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [selectedSection, setSelectedSection] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [lockedSections, setLockedSections] = useState([]);
//   const [pendingSection, setPendingSection] = useState('');
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(30 * 60);
//   const [submitted, setSubmitted] = useState(false);

//   const questionsPerPage = 2;

//   useEffect(() => {
//     axios.get('http://localhost:5000/api/questions')
//       .then(res => {
//         setQuestions(res.data);
//         if (res.data.length > 0) {
//           setSelectedSection(res.data[0].section);
//         }
//       });
//   }, []);

//   useEffect(() => {
//     setCurrentPage(1);
//     setTimeLeft(30 * 60);
//   }, [selectedSection]);

//   useEffect(() => {
//     if (submitted) return; // stop timer when submitted
//     const timer = setInterval(() => {
//       setTimeLeft(prev => {
//         if (prev <= 1) {
//           lockCurrentSection();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [selectedSection, submitted]);

//   const sections = [...new Set(questions.map(q => q.section))];
//   const filteredQuestions = questions.filter(q => q.section === selectedSection);
//   const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
//   const indexOfLastQuestion = currentPage * questionsPerPage;
//   const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
//   const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

//   const lockCurrentSection = () => {
//     setLockedSections(prev => [...new Set([...prev, selectedSection])]);
//   };

//   const handleSectionChange = (targetSection) => {
//     if (targetSection === selectedSection) return;
//     if (!lockedSections.includes(selectedSection)) {
//       setPendingSection(targetSection);
//       setConfirmOpen(true);
//     } else {
//       setSelectedSection(targetSection);
//     }
//   };

//   const confirmSwitch = () => {
//     lockCurrentSection();
//     setSelectedSection(pendingSection);
//     setPendingSection('');
//     setConfirmOpen(false);
//   };

//   const cancelSwitch = () => {
//     setPendingSection('');
//     setConfirmOpen(false);
//   };

//   const toggleOption = (qid, optionIdx) => {
//     if (submitted) return; // prevent changes after submit
//     const current = answers[qid] || [];
//     if (current.includes(optionIdx)) {
//       setAnswers({ ...answers, [qid]: current.filter(i => i !== optionIdx) });
//     } else {
//       setAnswers({ ...answers, [qid]: [...current, optionIdx] });
//     }
//   };

//   const toggleSelectAll = (q) => {
//     if (submitted) return;
//     if ((answers[q._id]?.length || 0) === q.options.length) {
//       setAnswers({ ...answers, [q._id]: [] });
//     } else {
//       setAnswers({ ...answers, [q._id]: q.options.map((_, i) => i) });
//     }
//   };

//   const arraysEqual = (a, b) =>
//     a.length === b.length && a.every((v, i) => v === b[i]);

//   const formatTime = () => {
//     const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
//     const s = (timeLeft % 60).toString().padStart(2, '0');
//     return `${m}:${s}`;
//   };

//   const submit = async () => {
//     let totalScore = 0;
//     questions.forEach(q => {
//       if (q.type === 'single') {
//         if (q.correctAnswer === Number(answers[q._id])) totalScore++;
//       } else if (q.type === 'multiple') {
//         const selected = answers[q._id] || [];
//         if (arraysEqual(selected.sort(), q.correctAnswer.sort())) totalScore++;
//       }
//     });

//     try {
//       await axios.post('http://localhost:5000/api/submit', {
//         answers,
//         totalScore
//       });

//       localStorage.removeItem('token');  // logout
//       setSubmitted(true);                // lock UI
//       alert(`Test submitted! Your score: ${totalScore}/${questions.length}`);
//       window.location.href = '/login';   // redirect
//     } catch (err) {
//       console.error('Submit failed', err);
//       alert('Something went wrong submitting your test.');
//     }
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
//       <h2>Online Test</h2>
//       <p><strong>Section:</strong> {selectedSection} &nbsp; | &nbsp; <strong>Time Left:</strong> {formatTime()}</p>

//       {/* Section Selector */}
//       <div style={{ marginBottom: '10px' }}>
//         <Select value={selectedSection} onChange={e => handleSectionChange(e.target.value)} disabled={submitted}>
//           {sections.map(section => (
//             <MenuItem
//               key={section}
//               value={section}
//               disabled={(lockedSections.includes(section) && section !== selectedSection) || submitted}
//             >
//               {section} {lockedSections.includes(section) && section !== selectedSection ? '(Locked)' : ''}
//             </MenuItem>
//           ))}
//         </Select>
//       </div>

//       {/* Questions */}
//       {currentQuestions.map((q, idx) => (
//         <div key={q._id} style={{ marginBottom: '15px' }}>
//           <p><strong>Q{indexOfFirstQuestion + idx + 1}:</strong> {q.text}</p>
//           {q.type === 'multiple' && (
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={(answers[q._id]?.length || 0) === q.options.length}
//                   onChange={() => toggleSelectAll(q)}
//                   disabled={submitted}
//                 />
//               }
//               label="Select All"
//             />
//           )}
//           {q.options.map((opt, i) => (
//             <FormControlLabel
//               key={i}
//               control={
//                 q.type === 'single' ? (
//                   <Radio
//                     checked={Number(answers[q._id]) === i}
//                     onChange={() => !submitted && setAnswers({ ...answers, [q._id]: i })}
//                     disabled={submitted}
//                   />
//                 ) : (
//                   <Checkbox
//                     checked={answers[q._id]?.includes(i) || false}
//                     onChange={() => toggleOption(q._id, i)}
//                     disabled={submitted}
//                   />
//                 )
//               }
//               label={opt}
//               style={{ display: 'block' }}
//             />
//           ))}
//         </div>
//       ))}

//       {/* Pagination */}
//       <div style={{ marginTop: '10px' }}>
//         <Button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1 || submitted} variant="outlined">Prev</Button>
//         <span style={{ margin: '0 10px' }}>Page {currentPage} of {totalPages}</span>
//         <Button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || submitted} variant="outlined">Next</Button>
//       </div>

//       {/* Submit */}
//       <div style={{ marginTop: '20px' }}>
//         <Button onClick={submit} variant="contained" color="primary" disabled={submitted}>Submit Test</Button>
//       </div>

//       {/* Confirm Dialog */}
//       <Dialog open={confirmOpen} onClose={cancelSwitch}>
//         <DialogTitle>Switch Section</DialogTitle>
//         <DialogContent>
//           You won't be able to return to section <strong>{selectedSection}</strong>. Continue to <strong>{pendingSection}</strong>?
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={cancelSwitch}>Cancel</Button>
//           <Button onClick={confirmSwitch} color="primary" variant="contained">Confirm</Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControlLabel, Radio, Checkbox
} from '@mui/material';

export default function TestPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [selectedSection, setSelectedSection] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lockedSections, setLockedSections] = useState([]);
  const [pendingSection, setPendingSection] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [submitted, setSubmitted] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [resultScore, setResultScore] = useState(0);

  const questionsPerPage = 2;

  useEffect(() => {
    axios.get('http://localhost:5000/api/questions')
      .then(res => {
        setQuestions(res.data);
        if (res.data.length > 0) {
          setSelectedSection(res.data[0].section);
        }
      })
      .catch(err => console.error('Failed to load questions:', err));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    setTimeLeft(30 * 60);
  }, [selectedSection]);

  useEffect(() => {
    if (submitted) return; // stop timer when submitted
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          lockCurrentSection();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedSection, submitted]);

  const sections = [...new Set(questions.map(q => q.section))];
  const filteredQuestions = questions.filter(q => q.section === selectedSection);
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  const lockCurrentSection = () => {
    setLockedSections(prev => [...new Set([...prev, selectedSection])]);
  };

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
    lockCurrentSection();
    setSelectedSection(pendingSection);
    setPendingSection('');
    setConfirmOpen(false);
  };

  const cancelSwitch = () => {
    setPendingSection('');
    setConfirmOpen(false);
  };

  const toggleOption = (qid, optionIdx) => {
    if (submitted) return;
    const current = answers[qid] || [];
    if (current.includes(optionIdx)) {
      setAnswers({ ...answers, [qid]: current.filter(i => i !== optionIdx) });
    } else {
      setAnswers({ ...answers, [qid]: [...current, optionIdx] });
    }
  };

  const toggleSelectAll = (q) => {
    if (submitted) return;
    if ((answers[q._id]?.length || 0) === q.options.length) {
      setAnswers({ ...answers, [q._id]: [] });
    } else {
      setAnswers({ ...answers, [q._id]: q.options.map((_, i) => i) });
    }
  };

  const arraysEqual = (a, b) =>
    a.length === b.length && a.every((v, i) => v === b[i]);

  const formatTime = () => {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const submit = async () => {
    let totalScore = 0;
    questions.forEach(q => {
      if (q.type === 'single') {
        if (q.correctAnswer === Number(answers[q._id])) totalScore++;
      } else if (q.type === 'multiple') {
        const selected = answers[q._id] || [];
        if (arraysEqual(selected.sort(), q.correctAnswer.sort())) totalScore++;
      }
    });

    try {
      await axios.post('http://localhost:5000/api/submit', {
        answers,
        totalScore
      });

      localStorage.removeItem('token');  // logout
      setResultScore(totalScore);        // save score
      setSubmitted(true);                // lock UI
      setResultOpen(true);               // open result dialog
    } catch (err) {
      console.error('Submit failed', err);
      alert('Something went wrong submitting your test.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Online Test</h2>
      <p><strong>Section:</strong> {selectedSection} &nbsp; | &nbsp; <strong>Time Left:</strong> {formatTime()}</p>

      {/* Section Selector */}
      <div style={{ marginBottom: '10px' }}>
        <Select value={selectedSection} onChange={e => handleSectionChange(e.target.value)} disabled={submitted}>
          {sections.map(section => (
            <MenuItem
              key={section}
              value={section}
              disabled={(lockedSections.includes(section) && section !== selectedSection) || submitted}
            >
              {section} {lockedSections.includes(section) && section !== selectedSection ? '(Locked)' : ''}
            </MenuItem>
          ))}
        </Select>
      </div>

      {/* Questions */}
      {currentQuestions.map((q, idx) => (
        <div key={q._id} style={{ marginBottom: '15px' }}>
          <p><strong>Q{indexOfFirstQuestion + idx + 1}:</strong> {q.text}</p>
          {q.type === 'multiple' && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={(answers[q._id]?.length || 0) === q.options.length}
                  onChange={() => toggleSelectAll(q)}
                  disabled={submitted}
                />
              }
              label="Select All"
            />
          )}
          {q.options.map((opt, i) => (
            <FormControlLabel
              key={i}
              control={
                q.type === 'single' ? (
                  <Radio
                    checked={Number(answers[q._id]) === i}
                    onChange={() => !submitted && setAnswers({ ...answers, [q._id]: i })}
                    disabled={submitted}
                  />
                ) : (
                  <Checkbox
                    checked={answers[q._id]?.includes(i) || false}
                    onChange={() => toggleOption(q._id, i)}
                    disabled={submitted}
                  />
                )
              }
              label={opt}
              style={{ display: 'block' }}
            />
          ))}
        </div>
      ))}

      {/* Pagination */}
      <div style={{ marginTop: '10px' }}>
        <Button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1 || submitted} variant="outlined">Prev</Button>
        <span style={{ margin: '0 10px' }}>Page {currentPage} of {totalPages}</span>
        <Button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || submitted} variant="outlined">Next</Button>
      </div>

      {/* Submit */}
      <div style={{ marginTop: '20px' }}>
        <Button onClick={submit} variant="contained" color="primary" disabled={submitted}>Submit Test</Button>
      </div>

      {/* Confirm Dialog for section switch */}
      <Dialog open={confirmOpen} onClose={cancelSwitch}>
        <DialogTitle>Switch Section</DialogTitle>
        <DialogContent>
          You won't be able to return to section <strong>{selectedSection}</strong>. Continue to <strong>{pendingSection}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelSwitch}>Cancel</Button>
          <Button onClick={confirmSwitch} color="primary" variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Result Dialog */}
      <Dialog open={resultOpen} onClose={() => {
        setResultOpen(false);
        window.location.href = '/login';
      }}>
        <DialogTitle>Test Submitted!</DialogTitle>
        <DialogContent>
          Your score: {resultScore} / {questions.length}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setResultOpen(false);
            window.location.href = '/login';
          }} color="primary" variant="contained">OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
