module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }

    req.flash("error_msg", "Please login to view this resource");
    res.redirect("/login");
  },

  doctorAuthenticated: function(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }

    req.flash("error_msg", "Please login to view this resource");
    res.redirect("/doctor-login");
  }
};
