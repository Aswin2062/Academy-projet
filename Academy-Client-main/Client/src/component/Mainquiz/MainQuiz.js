import React, { useEffect, useState } from "react";
import Footer from "../Footer/footer";
import "./mainquiz.css";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Navbar/navbar";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import quizHintLogo from "../Login/Images/quizhintlogo.svg";
import { getQuizData } from "../../Store/Slice/QuizDataSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded';
import Loader from "../Event/img/loader.gif";
import { Checkbox } from "@mui/material";
import { yellow } from '@mui/material/colors';

const MainQuiz = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [indexTo, setIndexTo] = useState(1);
  const [noOfPages, setNoOfPages] = useState(5);
  const [quizData, setQuizData] = useState();
  const [respondedAnswer, setRespondedAnswer] = useState([]);
  const [quizAnswer, setQuizAnswer] = useState([]);
  const [finalQuizAnswer, setFinalQuizAnswer] = useState();
  const [quizScoreStatus, setScoreStatus] = useState();
  const [errorbtnstatus, setbtnstatus] = useState();
  const [quizMarks, setQuizMarks] = useState();
  const [buttonText, setButtonText] = useState("next");
  const [popup, setPopup] = useState(false);
  const [checked, setChecked] = useState(false)

  const handleQuestionPage = (data) => {
    setIndex(data.selected);
    setIndexTo(data.selected + 1);
  };

  const handelQuizResponse = (e) => {
    e.preventDefault();

    const element = e.target.elements;
    const answer1value = element[0].value;
    const answer2value = element[1].value;
    const answer3value = element[2].value;
    const answer4value = element[3].value;
    const answer1 = element[0].checked;
    const answer2 = element[1].checked;
    const answer3 = element[2].checked;
    const answer4 = element[3].checked;

    if (index < noOfPages - 1 && indexTo < noOfPages) {
      setIndex(index + 1);
      setIndexTo(indexTo + 1);
    }

    element[0].checked = false;
    element[1].checked = false;
    element[2].checked = false;
    element[3].checked = false;

    if (answer1 === true) {
      respondedAnswer.push(answer1value);
    }
    if (answer2 === true) {
      respondedAnswer.push(answer2value);
    }
    if (answer3 === true) {
      respondedAnswer.push(answer3value);
    }
    if (answer4 === true) {
      respondedAnswer.push(answer4value);
    }

    if (buttonText === "submit") {
      setPopup(true);
    }
  };

  const handelSkipPage = () => {
    setIndex(index + 1);
    setIndexTo(indexTo + 1);
  };

  useEffect(() => {
    dispatch(getQuizData());
  }, []);

  const { quizInfo, getQuizDataLoading } = useSelector(
    (state) => state.getQuizInfo
  );

  const handleToggle = (e) => {
    setChecked(e.target.checked)
  }

  useEffect(() => {
    if (quizInfo.data && quizInfo.data.data) {
      setQuizData(quizInfo.data.data);
      setNoOfPages(quizInfo.data.data.length);
      quizInfo.data.data.forEach((element) => {
        quizAnswer.push(element.Key);
      }, []);
    }
  }, [quizInfo]);

  console.log(quizData)

  useEffect(() => {
    if (indexTo === noOfPages) {
      setbtnstatus(1);
      setFinalQuizAnswer(quizAnswer.slice(0, noOfPages));
    }
  }, [indexTo, index]);

  const endTest = () => {
    const forAnswer = []
    console.log(finalQuizAnswer, "final quiz answer");
    respondedAnswer.map((e) => {
      forAnswer.push(parseInt(e))
    })
    console.log(forAnswer, "responded answer");
    const a = window.confirm("Do you want to close your test");
    if (a === true) {
      const correctAnswer = forAnswer.filter((element1) =>
        finalQuizAnswer.some((element2) => element1 === element2)
      );
      console.log(correctAnswer, "correct answer");
      const quizMarkss = correctAnswer.length;
      setQuizMarks(quizMarkss);
      setScoreStatus(1);
      setButtonText("submitted");
    }
  };

  console.log(quizData?.slice(index, indexTo))
  console.log(index)
  console.log(indexTo)

  const closeQuiz = () => {
    navigate("/quiz");
  };

  useEffect(() => {
    setTimeout(() => {
      if (errorbtnstatus === 1) {
        setButtonText("submit");
      }
    }, "10000");
  }, [errorbtnstatus, buttonText]);

  return (
    <div>
      <Navbar />
      <div className="main-quiz--conatiner">
        {!getQuizDataLoading && quizInfo ? <div className="quiz-questions">
          <div className="quiz-questions--header">
              <div className="quiz-question-container">
                <h1 className="Question-number">
                  Question {indexTo}
                </h1>
              </div>
          </div>

          <div className="quiz-Choose_testPage">
            <div>
              {popup === true ? (
                <p className="after-quiz-questions">
                  Quiz Completed please end test to view your scores
                </p>
              ) : null}
            </div>

            <meter
              min="0"
              max={noOfPages}
              value={index + 1}
              className="meter-scale"
            ></meter>

            {
              <div>
                {quizData &&
                  quizData.slice(index, indexTo).map((obj) => (
                    <div className="quiz-test_Choose">
                      {obj.Hint != "NA" && <div className="quizhint-logo--container">
                        <Checkbox checked={checked} 
                        onChange={handleToggle} 
                        icon={<TipsAndUpdatesOutlinedIcon/>} 
                        checkedIcon={<TipsAndUpdatesRoundedIcon/>} 
                        className="hint_Box"
                        sx={{
                          color: yellow[800],
                          '&.Mui-checked': {
                            color: yellow[600],
                          },
                        }}/>
                      </div>}
                      {checked && <div>
                          <h2>{obj.Hint}</h2>
                        </div>
                      }
                      <p className="question">{obj.Stem}</p>
                      {obj.Image != "NA" && <div>
                        <img src={`${obj.Image}`} alt="" className="quiz-Question_Image"/>
                      </div>}
                      <form onSubmit={handelQuizResponse}>
                        <div className="option--container">
                          <label className="question-option">
                            <input
                              type="radio"
                              value={1}
                              key={obj.distractor1}
                              name="quizOption"
                            ></input>
                            <p>{obj.distractor1}</p>
                          </label>
                          <label className="question-option">
                            <input
                              type="radio"
                              value={2}
                              key={obj.distractor2}
                              name="quizOption"
                            ></input>
                            <p>{obj.distractor2}</p>
                          </label>
                          <label className="question-option">
                            <input
                              type="radio"
                              value={3}
                              key={obj.distractor3}
                              name="quizOption"
                            ></input>
                            <p>{obj.distractor3}</p>
                          </label>
                          <label className="question-option">
                            <input
                              type="radio"
                              value={4}
                              key={obj.distractor4}
                              name="quizOption"
                              className="question-option-input"
                            ></input>
                            <p>{obj.distractor4}</p>
                          </label>
                          <button
                            className={buttonText}
                            onClick={buttonText === "submit" && endTest}
                          >
                            {buttonText}
                          </button>
                        </div>
                      </form>
                    </div>
                  ))}
              </div>
            }
          </div>

          <div className="react-paginate--container">
            <ReactPaginate
              className="react-paginate"
              previousLabel={"<"}
              previousClassName={"previous-class"}
              pageClassName={"page-class"}
              onPageChange={handleQuestionPage}
              pageCount={noOfPages}
              breakClassName={"break-class"}
              breakLabel={"."}
              nextLabel={">"}
              nextClassName={"previous-class"}
            />

            <div className="endtest-block">
              <button className="Endtest-btn" onClick={endTest}>
                End Test
              </button>
              <div>
                {quizScoreStatus === 1 ? (
                  <button
                    type="button"
                    class="Endtest-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                  >
                    View Score
                  </button>
                ) : null}
              </div>
              <div>
                <button onClick={handelSkipPage} className="Skip-btn">
                  Skip
                </button>
              </div>
            </div>

            <div
              class="modal fade"
              id="staticBackdrop"
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabindex="-1"
              aria-labelledby="staticBackdropLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">
                      quiz Scores
                    </h1>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                    You have scored:{quizMarks}/{noOfPages} in quiz
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                      onClick={closeQuiz}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> : <img src={Loader} alt="" />}

        <div>
          <div className="chapters-container">
            <p>Chapters</p>
            <p>Machines</p>
            <p>Networks</p>
            <p> Electricals</p>
            <p>Java</p>
            <p>C++</p>
            <p>Python</p>
            <p>Javascript</p>
            {/* <button className="chapter-seemore-btn">See More</button> */}
          </div>
        </div>
      </div>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default MainQuiz;
