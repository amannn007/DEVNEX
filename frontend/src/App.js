import { BrowserRouter as Router, Routes, Route,Link } from "react-router-dom";
import Quiz from "./components/Quiz";
import Result from "./components/Result";
import QuizBuilder from "./components/QuizBuilder";
import CustomQuizList from "./components/customQuizList";
import StartQuiz from "./components/Home";
import "./App.css"

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Quiz App</h1>
      <nav>
        <ul>
          <li>
            <Link to="/start-quiz">Start Quiz</Link>
          </li>
          <li>
            <Link to="/create-quiz">Create Custom Quiz</Link>
          </li>
          <li>
            <Link to="/custom-quizzes">Available Custom Quiz</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};






function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/start-quiz" element={<Quiz />} />
        <Route path="/result" element={<Result />} />
        <Route path="/create-quiz" element={<QuizBuilder />} />
        <Route path="/custom-quizzes" element={<CustomQuizList />} />
        {/* Add route for taking a custom quiz */}
      </Routes>
    </Router>
  );
}

export default App;
