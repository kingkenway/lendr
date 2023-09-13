const mono = require("./mono");

exports.getAccess = (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  res.render("loan", {
    title: "Loan · Access quick loans",
  });
};

exports.postAccess = (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }

  const validationErrors = [];

  if (req.body?.amount < 50000) {
    validationErrors.push({
      msg: "The minimum loan amount we can provision is NGN 50,000",
    });
  } else if (req.body?.amount > 500000) {
    validationErrors.push({
      msg: "The maximum loan amount we provision is NGN 500,000",
    });
  }

  if (validationErrors.length) {
    // If there are validation errors, add them to flash messages and redirect to login page
    req.flash("errors", validationErrors);
    return res.redirect("/access");
  }

  return res.redirect("/verification-1");
};

exports.getVerification1 = (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  res.render("verification-1", {
    title: "Loan · Access quick loans",
  });
};

exports.postVerification1 = async (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }

  console.log(req.user._id);

  const validationErrors = [];

  if (req.body?.type) {
    const type = req.body.type;
    const id = req.body.number;

    if (type === "bvn") {
      const result = await mono.verifyBVN(id);

      if (
        result?.message ===
        "Invalid request, please check your request and try again."
      ) {
        validationErrors.push({
          msg: "There was an issue verifying your BVN number.",
        });
      } else {
        return res.redirect("/verification-2");
      }
    } else if (type === "nin") {
      const result = await mono.verifyNIN(id);

      if (result.status === "failed") {
        validationErrors.push({
          msg: "There was an issue verifying your NIN number.",
        });
      } else {
        return res.redirect("/verification-2");
      }
    }
  } else {
    validationErrors.push({
      msg: "Identity type not verified",
    });
  }

  if (validationErrors.length) {
    // If there are validation errors, add them to flash messages and redirect to login page
    req.flash("errors", validationErrors);
    return res.redirect("/verification-1");
  }

  //   res.render("verification1", {
  //     title: "Loan · Access quick loans",
  //   });
};

exports.getVerification2 = (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  res.render("verification-2", {
    title: "Loan · Access quick loans",
  });
};

exports.postVerification2 = (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }

  return res.redirect("/verification-3");

  // res.render("verification-2", {
  //   title: "Loan · Access quick loans",
  // });
};

exports.getVerification3 = (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  res.render("verification-3", {
    title: "Loan · Access quick loans",
  });
};

exports.postVerification3 = (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }

  return res.redirect("/congratulations");

  // res.render("verification-3", {
  //   title: "Loan · Access quick loans",
  // });
};

exports.getCongratulations = (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  res.render("congratulations", {
    title: "Loan · Access quick loans",
  });
};

exports.postWebhook = async (req, res, next) => {
  const webhook = req.body;

  if (webhook.event == "mono.events.account_updated") {
    await WebH.create({ test: "updated" });

    if (webhook.data.meta.data_status == "AVAILABLE") {
      // AVAILABLE, PROCESSING, FAILED

      const data = webhook.data.account;

      // You can update your records on success

      const query = {
        monoId: data._id,
      };

      const result = {
        $set: {
          monoId: data._id,
          institution: data.institution.name, // name:bankCode:type
          name: data.name,
          accountNumber: data.accountNumber,
          type: data.type,
          currency: data.currency,
          balance: data.balance,
          bvn: data.bvn,
        },
      };

      await Account.updateOne(
        query,
        result,
        { new: true },
        function (err, res) {}
      );

      await WebH.create({ test: "updated___available_id: " + data._id });

      // webhook.data.account
    } else if (webhook.data.meta.data_status == "PROCESSING") {
      await WebH.create({ test: "updated___processing" });
      // Lol! Just chill and wait
    }
  } else if (webhook.event == "mono.events.reauthorisation_required") {
    // webhook.data.account._id

    // You can retrieve your token here for re-authentication
    // reauthorise(webhook.data.account._id)
    const query = {
      monoId: data._id,
    };

    const result = {
      $set: {
        monoStatus: true,
      },
    };

    await User.updateOne(query, result, { new: true }, function (err, res) {});

    await WebH.create({ test: "reauthorisation_required" });
  } else if (webhook.event == "mono.events.account_reauthorized") {
    // webhook.data.account._id

    // Account Id. will be sent on successful reauthorisation. Nothing much to do here.
    await WebH.create({ test: "account_reauthorized" });
  }

  return res.sendStatus(200);
};
