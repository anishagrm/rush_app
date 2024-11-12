const { db, firebaseAdmin } = require("../util/firebaseAdmin");

function calcSatisfaction(rusheeObject) {
  if (rusheeObject.satisfactory === 0 && rusheeObject.unsatisfactory === 0) {
    return "N/A";
  }
  var total = rusheeObject.satisfactory + rusheeObject.unsatisfactory;
  var ratio = (rusheeObject.satisfactory / total) * 100;
  return ratio.toFixed(2);
}

exports.updateAll = (req, res) => {
  //update nights
  db.collection("attendance")
    .get()
    .then((nights) => {
      nightDict = {};
      nights.forEach((night) => {
        nightDict[night.id] = night.data().attendance;
      });

      return nightDict;
    })
    .then((nightDict) => {
      db.collection("rushees")
        .get()
        .then((rushees) =>
          rushees.forEach((rushee) => {
            var nights = [];
            for (var night in nightDict) {
              var attendanceList = nightDict[night];

              for (var attendance of attendanceList) {
                if (attendance.GTID === parseInt(rushee.id)) {
                  nights.push(night);
                }
              }
            }

            return rushee.ref.update({
              nights: nights,
            });
          })
        )
        .catch((err) => {
          console.error(err);
        });
      return null;
    })
    .catch((err) => {
      console.error(err);
    });

  //update survey data
  db.collection("rushees")
    .get()
    .then((rushees) =>
      rushees.forEach((rushee) => {
        db.collection(`rushees/${rushee.data().gtid}/surveys`)
          .get()
          .then((surveys) => {
            // console.log(surveys);
            var totalSurveys = 0;
            var totalYes = 0;
            var brotherhood = {
              satisfactory: 0,
              unsatisfactory: 0,
            };
            var leadership = {
              satisfactory: 0,
              unsatisfactory: 0,
            };
            var growth = {
              satisfactory: 0,
              unsatisfactory: 0,
            };
            var professionalism = {
              satisfactory: 0,
              unsatisfactory: 0,
            };
            surveys.forEach((survey) => {
              survey = survey.data().survey;
              totalSurveys += 1;
              if (survey.extendBid) {
                totalYes += 1;
              }
              if (survey.professionalism === "Satisfactory") {
                professionalism.satisfactory += 1;
              } else if (survey.professionalism === "Unsatisfactory") {
                professionalism.unsatisfactory += 1;
              }

              if (survey.growth === "Satisfactory") {
                growth.satisfactory += 1;
              } else if (survey.growth === "Unsatisfactory") {
                growth.unsatisfactory += 1;
              }

              if (survey.leadership === "Satisfactory") {
                leadership.satisfactory += 1;
              } else if (survey.leadership === "Unsatisfactory") {
                leadership.unsatisfactory += 1;
              }

              if (survey.brotherhood === "Satisfactory") {
                brotherhood.satisfactory += 1;
              } else if (survey.brotherhood === "Unsatisfactory") {
                brotherhood.unsatisfactory += 1;
              }
            });

            return rushee.ref.update({
              totalSurveys: totalSurveys,
              totalYes: totalYes,
              brotherhood: calcSatisfaction(brotherhood),
              leadership: calcSatisfaction(leadership),
              professionalism: calcSatisfaction(professionalism),
              growth: calcSatisfaction(growth),
            });
          })
          .catch((err) => {
            console.error(err);
          });
      })
    )
    .then(() => {
      return res.json({ message: `documents updated successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "error updating rushees" });
      console.error(err);
    });
};

exports.getConstants = (req, res) => {
  db.doc(`/app-data/constants`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(400).json({ error: "constants not found" });
      }
      return doc;
    })
    .then((doc) => {
      return res.json({ constants: doc.data() });
    })
    .catch((err) => {
      res.status(500).json({ error: "error getting constants" });
      console.error(err);
    });
};

exports.updateConstants = (req, res) => {
  db.doc(`/app-data/constants`)
    .update(req.body.constants)
    .then(() => {
      return res.json({ message: `constants updated successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "error updating constants" });
      console.error(err);
    });
}

exports.exportDatabase = (req, res) => {
  db.collection("rushees")
    .get()
    .then((rusheeDocs) => {
      var rusheeList = [];
      var PISList = [];
      var surveyList = [];
      var promises = [];
      rusheeDocs.forEach((rusheeDoc) => {
        let rushee = rusheeDoc.data();

        rushee.nightO1 = rushee.nights.includes("O1");
        rushee.nightO2 = rushee.nights.includes("O2");
        rushee.nightC = rushee.nights.includes("C");
        delete rushee.nights;

        //get PIS data
        if (rushee.PIS) {
          let PIS = rushee.PIS;
          PIS.brotherReview0 = PIS.brotherReviews[0];
          PIS.brotherReview1 = PIS.brotherReviews[1];
          PIS.brother0 = PIS.brothers[0];
          PIS.brother1 = PIS.brothers[1];
          PIS.graduation = PIS.responses.graduationDate;
          PIS.scribe = PIS.responses.scribeName;
          PIS.rusheeGTID = PIS.responses.GTID;

          for (let i = 0; i < PIS.responses.questions.length; i++) {
            PIS[PIS.responses.questions[i]] = PIS.responses.questionsResponse[i];
          }

          for (let i = 0; i < PIS.responses.optionalQuestions.length; i++) {
            PIS[PIS.responses.optionalQuestions[i]] = PIS.responses.optionalQuestionsResponse[i];
          }

          for (let i = 0; i < PIS.responses.requiredDates.length; i++) {
            PIS[PIS.responses.requiredDates[i]] = PIS.responses.requiredDatesResponse[i];
          }

          delete PIS.responses;
          delete PIS.brothers;
          delete PIS.brotherReviews;
          PISList.push(PIS);
        }
        delete rushee.PIS;


        rusheeList.push(rushee);
        promises.push(
          db
            .collection(`/rushees/${rusheeDoc.data().gtid}/surveys`)
            .get()
            .then((surveyDocs) => {
              surveyDocs.forEach((surveyDoc) => {
                let survey = surveyDoc.data();
                survey.anonymous = survey.survey.anonymous;
                survey.extendBid = survey.survey.extendBid;
                survey.body = survey.survey.body;
                survey.brotherhood = survey.survey.brotherhood;
                survey.growth = survey.survey.growth;
                survey.leadership = survey.survey.leadership;
                survey.professionalism = survey.survey.professionalism;
                survey.night = survey.survey.night;
                delete survey.survey;
                surveyList.push(survey);
              });
              return surveyList;
            })
        );
      });
      return Promise.all(promises).then(() => {
        return [rusheeList, surveyList, PISList];
      });
    })
    .then(([rusheeList, surveyList, PISList]) => {
      var attendanceList = [];
      let nights = ["O1", "O2", "C"];
      let promises = [];
      nights.forEach((night) => {
        promises.push(
          db
            .doc(`/attendance/${night}`)
            .get()
            .then((attendanceDoc) => {
              let attendance = attendanceDoc.data().attendance;
              attendance.forEach((att) => {
                att.night = night;
                attendanceList.push(att);
              });
              return attendanceList;
            })
        );
      });
      return Promise.all(promises).then(() => {
        return [rusheeList, surveyList, PISList, attendanceList];
      });
    })
    .then(([rusheeList, surveyList, PISList, attendanceList]) => {
      return res.json({ rushees: rusheeList, surveys: surveyList, pises: PISList, attendance: attendanceList });
    })
    .catch((err) => {
      res.status(500).json({ error: "error exporting database" });
      console.error(err);
    });
}