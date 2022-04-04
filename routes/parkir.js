var express = require("express");
var router = express.Router();
var authentication_mdl = require("../middlewares/authentication");
var session_store;
/* GET Parkir page. */

router.get("/", authentication_mdl.is_login, function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      "SELECT * FROM parkir",
      function (err, rows) {
        if (err) var errornya = ("Error Selecting : %s ", err);
        req.flash("msg_error", errornya);
        res.render("parkir/list", {
          title: "Parkir",
          data: rows,
          session_store: req.session,
        });
      }
    );
    //console.log(query.sql);
  });
});

router.delete(
  "/delete/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var parkir = {
        id: req.params.id,
      };

      var delete_sql = "delete from parkir where ?";
      req.getConnection(function (err, connection) {
        var query = connection.query(
          delete_sql,
          parkir,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Delete : %s ", err);
              req.flash("msg_error", errors_detail);
              res.redirect("/parkir");
            } else {
              req.flash("msg_info", "Delete Parkir Success");
              res.redirect("/parkir");
            }
          }
        );
      });
    });
  }
);
router.get(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var query = connection.query(
        "SELECT * FROM parkir where id=" + req.params.id,
        function (err, rows) {
          if (err) {
            var errornya = ("Error Selecting : %s ", err);
            req.flash("msg_error", errors_detail);
            res.redirect("/parkir");
          } else {
            if (rows.length <= 0) {
              req.flash("msg_error", "Data can't be find!");
              res.redirect("/parkir");
            } else {
              console.log(rows);
              res.render("parkir/edit", {
                title: "Edit ",
                data: rows[0],
                session_store: req.session,
              });
            }
          }
        }
      );
    });
  }
);
router.put(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.assert("jenis", "Please fill the jenis").notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
      v_jenis = req.sanitize("jenis").escape().trim();
      v_jumlah = req.sanitize("jumlah").escape().trim();
      v_harga = req.sanitize("harga").escape().trim();
      v_waktu = req.sanitize("waktu").escape();

      var parkir = {
        jenis: v_jenis,
        jumlah: v_jumlah,
        harga: v_harga,
        waktu: v_waktu,
      };

      var update_sql = "update parkir SET ? where id = " + req.params.id;
      req.getConnection(function (err, connection) {
        var query = connection.query(
          update_sql,
          parkir,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Update : %s ", err);
              req.flash("msg_error", errors_detail);
              res.render("parkir/edit", {
                jenis: req.param("jenis"),
                jumlah: req.param("jumlah"),
                harga: req.param("harga"),
                waktu: req.param("waktu"),
              });
            } else {
              req.flash("msg_info", "Update parkir success");
              res.redirect("/parkir/edit/" + req.params.id);
            }
          }
        );
      });
    } else {
      console.log(errors);
      errors_detail = "<p>Sory there are error</p><ul>";
      for (i in errors) {
        error = errors[i];
        errors_detail += "<li>" + error.msg + "</li>";
      }
      errors_detail += "</ul>";
      req.flash("msg_error", errors_detail);
      res.redirect("/parkir/edit/" + req.params.id);
    }
  }
);

router.post("/add", authentication_mdl.is_login, function (req, res, next) {
  req.assert("jenis", "Please fill the jenis").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_jenis = req.sanitize("jenis").escape().trim();
    v_jumlah = req.sanitize("jumlah").escape().trim();
    v_harga = req.sanitize("harga").escape().trim();
    v_waktu = req.sanitize("waktu").escape();

    var parkir = {
      jenis: v_jenis,
      jumlah: v_jumlah,
      harga: v_harga,
      waktu: v_waktu,
    };

    var insert_sql = "INSERT INTO parkir SET ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(
        insert_sql,
        parkir,
        function (err, result) {
          if (err) {
            var errors_detail = ("Error Insert : %s ", err);
            req.flash("msg_error", errors_detail);
            res.render("parkir/add-parkir", {
              jenis: req.param("jenis"),
              jumlah: req.param("jumlah"),
              harga: req.param("harga"),
              waktu: req.param("waktu"),
              session_store: req.session,
            });
          } else {
            req.flash("msg_info", "Create parkir success");
            res.redirect("/parkir");
          }
        }
      );
    });
  } else {
    console.log(errors);
    errors_detail = "<p>Sory there are error</p><ul>";
    for (i in errors) {
      error = errors[i];
      errors_detail += "<li>" + error.msg + "</li>";
    }
    errors_detail += "</ul>";
    req.flash("msg_error", errors_detail);
    res.render("parkir/add-parkir", {
      jenis: req.param("jenis"),
      jumlah: req.param("jumlah"),
      session_store: req.session,
    });
  }
});

router.get("/add", authentication_mdl.is_login, function (req, res, next) {
  res.render("parkir/add-parkir", {
    title: "Add New Parkir",
    jenis: "",
    jumlah: "",
    harga: "",
    waktu: "",
    session_store: req.session,
  });
});

module.exports = router;
