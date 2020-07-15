const mysql = require("mysql");
const pool = require("./index");

let stpdbStudent = {};

stpdbStudent.modulesAll = async (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM Module WHERE StudyProgramme_idStudyProgramme = ?",
      id,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        var resultModule = results;
        pool.query(
          "SELECT p.Module_idModule, p.Module_idModule_Prerequisite, m.Name FROM Prerequisite_Module as p JOIN module as m on p.Module_idModule = m.idModule WHERE m.StudyProgramme_idStudyProgramme = ?",
          id,
          (err, results) => {
            if (err) {
              return reject(err);
            }
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
                if (err) {
                  return reject(err);
                }
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
                    if (err) {
                      return reject(err);
                    }
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
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

module.exports = stpdbStudent;
