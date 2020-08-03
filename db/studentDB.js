const mysql = require("mysql");
const pool = require("./index");

let stpdbStudent = {};

stpdbStudent.modulesAll = async (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM Module WHERE StudyProgramme_idStudyProgramme = ?",
      id,
      (err, results) => {
        if (err) return reject(err);

        var resultModule = results;
        pool.query(
          "SELECT p.Module_idModule, p.Module_idModule_Prerequisite, m.Name FROM Prerequisite_Module as p JOIN module as m on p.Module_idModule_Prerequisite = m.idModule WHERE m.StudyProgramme_idStudyProgramme = ?",
          id,
          (err, results) => {
            if (err) return reject(err);

            const resultPreModules = results;

            resultModule.forEach((rm) => {
              rm["prerequisiteModule"] = resultPreModules
                .filter((rpm) => rpm.Module_idModule === rm.idModule)
                .map(({ Module_idModule, ...keepAttrs }) => keepAttrs);
            });

            pool.query(
              "SELECT p.Module_idModule, p.Semester_idSemester, p.Mode FROM Module_has_ProposedSemester as p JOIN module as m on p.Module_idModule = m.idModule WHERE m.StudyProgramme_idStudyProgramme = ?",
              id,
              (err, results) => {
                if (err) return reject(err);

                const resultProposedSemester = results;

                resultModule.forEach((rm) => {
                  rm["proposedSemester"] = resultProposedSemester
                    .filter((rps) => rps.Module_idModule === rm.idModule)
                    .map(({ Module_idModule, ...keepAttrs }) => keepAttrs);
                });

                pool.query(
                  "SELECT m.Module_idModule as idModule, m.ExamType_idExamType as idExamType, m.Number, m.DurationInMin, m.Weight, m.Evaluation, e.Type FROM Module_has_Exam as m JOIN ExamType as e on m.ExamType_idExamType = e.idExamType JOIN module as mo on m.Module_idModule = mo.idModule WHERE mo.StudyProgramme_idStudyProgramme = ?",
                  id,
                  (err, results) => {
                    if (err) return reject(err);

                    const resultExams = results;

                    resultModule.forEach((rm) => {
                      rm["exams"] = resultExams
                        .filter((re) => re.idModule === rm.idModule)
                        .map(({ Module_idModule, ...keepAttrs }) => keepAttrs);
                    });

                    return resolve(resultModule);
                  }
                );
              }
            );
          }
        );
      }
    );
  });
};

stpdbStudent.moduleGroups = async (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM ModuleGroup WHERE StudyProgramme_idStudyProgramme = ?",
      id,
      (err, results) => (err ? reject(err) : resolve(results))
    );
  });
};

stpdbStudent.plan = async (email) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT Semester_idSemester, Module_idModule, hasPassed FROM Plan WHERE Student_User_email = ?",
      email,
      (err, results) => {
        if (err) return reject(err);

        return resolve(
          results.reduce((r, a) => {
            r[a.Semester_idSemester] = r[a.Semester_idSemester] || [];
            r[a.Semester_idSemester].push(a);
            return r;
          }, Object.create(null))
        );
      }
    );
  });
};

stpdbStudent.addToPlan = (email, idSemester, idModule) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO Plan (Student_User_email, Semester_idSemester, Module_idModule) VALUES (?, ?, ?)",
      [email, idSemester, idModule],
      (err, results) => (err ? reject(err) : resolve(results))
    );
  });
};

stpdbStudent.deleteFromPlan = (email, idSemester, idModule) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM Plan WHERE Student_User_email = ? AND Semester_idSemester = ? AND Module_idModule = ?",
      [email, idSemester, idModule],
      (err, results) => (err ? reject(err) : resolve(results))
    );
  });
};

stpdbStudent.semester = async (email) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT Semester_idSemester FROM Student_has_Semester WHERE Student_User_email = ?",
      email,
      (err, results) => (err ? reject(err) : resolve(results))
    );
  });
};

stpdbStudent.addSemester = (email, idSemester) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO Student_has_Semester (Student_User_email, Semester_idSemester) VALUES (?, ?)",
      [email, idSemester],
      (err, results) => (err ? reject(err) : resolve(results))
    );
  });
};

stpdbStudent.deleteSemester = (email, idSemester) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM Student_has_Semester WHERE Student_User_email = ? AND Semester_idSemester = ?",
      [email, idSemester],
      (err, results) => {
        if (err) return reject(err);

        pool.query(
          "DELETE FROM Plan WHERE Student_User_email = ? AND Semester_idSemester = ?",
          [email, idSemester],
          (err, results) => {
            if (err) {
              return reject(err);
            }
            return resolve(results);
          }
        );
      }
    );
  });
};

stpdbStudent.hasPassed = (email, id, hasPassed) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE Plan SET hasPassed = ? where Student_User_email = ? AND Module_idModule = ?",
      [hasPassed, email, id],
      (err, results) => (err ? reject(err) : resolve(results))
    );
  });
};

module.exports = stpdbStudent;
