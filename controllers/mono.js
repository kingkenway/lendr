const fetch = require("node-fetch");
const User = require("../models/User");
const Balance = require("../models/Account");
const WebH = require("../models/Webhook");
// const { isDataAvailable } = require("../controllers/helper");

module.exports.dashboard = async (monoId) => {
  const url = `https://api.withmono.com/accounts/${monoId}/identity`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "mono-sec-key": process.env["MONO_SECRET_KEY"],
    },
  });

  const data = await response.json();
  console.log(data);
  return data;
};

module.exports.dashboardPost = async (req, res, next) => {
  // Retrieve code and user id from front end
  const { code, id } = req.body;

  url = "https://api.withmono.com/account/auth";

  if (code) {
    // Retrieve mono id from front end
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ code }),
      headers: {
        "Content-Type": "application/json",
        "mono-sec-key": process.env["MONO_SECRET_KEY"],
      },
    })
      .then((res_) => res_.json())
      .then(function (res_) {
        const dispatch = {
          $set: {
            monoId: res_.id,
            monoCode: code,
            monoStatus: false,
          },
        };

        // Update collection with mono id and code
        User.updateOne(
          { _id: id },
          dispatch,
          { new: true },
          function (err, res) {}
        );
        // Create instance in our balance collection
        Account({ monoId: res_.id }).save();

        res.status(200).json("done");
      })
      .catch((err) => res.status(501).send("Error fetching id"));
  } else {
    res.status(500).json({ error: "Error somewhere" });
  }

  // next();
};

module.exports.balances = async (req, res, next) => {
  if (res.locals.data.user.monoId) {
    const url = `https://api.withmono.com/accounts/${res.locals.data.user.monoId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "mono-sec-key": process.env["MONO_SECRET_KEY"],
      },
    });

    const data = await response.json();
    res.locals.balances = data;
    next();
  } else {
    res.locals.balances = "";
    next();
  }
};

module.exports.transactions = async (req, res, next) => {
  if (res.locals.data.user.monoId) {
    if (await isDataAvailable(res.locals.data.user.monoId)) {
      const url =
        req.query.page ||
        `https://api.withmono.com/accounts/${res.locals.data.user.monoId}/transactions`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "mono-sec-key": process.env["MONO_SECRET_KEY"],
        },
      });

      const data = await response.json();
      res.locals.transactions = data;
      next();
    }

    res.locals.transactions = "PROCESSING";
    next();
  } else {
    res.locals.transactions = null;
    next();
  }
};

module.exports.alltransactions = async (req, res, next) => {
  if (res.locals.data.user.monoId) {
    // Check if data is still processing
    if (await isDataAvailable(res.locals.data.user.monoId)) {
      let url = `https://api.withmono.com/accounts/${res.locals.data.user.monoId}/transactions`;
      let page = req.query.page || 1;
      let finalUrl = url + `?page=${page}`;

      const response = await fetch(finalUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "mono-sec-key": process.env["MONO_SECRET_KEY"],
        },
      });

      const data = await response.json();
      res.locals.transactions = data;
      next();
    }

    res.locals.transactions = "PROCESSING";
    next();
  } else {
    res.locals.transactions = null;
    next();
  }
};

module.exports.reauthorise = async function (id) {
  let url = `https://api.withmono.com/accounts/${id}/reauthorise`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "mono-sec-key": process.env["MONO_SECRET_KEY"],
    },
  });

  const data = await response.json();

  return data.token;
};

module.exports.verifyBVN = async function (bvn) {
  let url = `https://api.withmono.com/v2/lookup/bvn
  `;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "mono-sec-key": process.env["MONO_SECRET_KEY"],
    },
    body: JSON.stringify({
      bvn,
    }),
  });

  const data = await response.json();
  console.log(data);
  return data;
};

module.exports.verifyNIN = async function (nin) {
  let url = `https://api.withmono.com/v3/lookup/nin
  `;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "mono-sec-key": process.env["MONO_SECRET_KEY"],
    },
    body: JSON.stringify({
      nin,
    }),
  });

  const data = await response.json();
  return data;
};

module.exports.manualSync = async (req, res, next) => {
  if (res.locals.data.user.monoId) {
    const url = `https://api.withmono.com/accounts/${res.locals.data.user.monoId}/sync`;

    // console.log(123412345);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "mono-sec-key": process.env["MONO_SECRET_KEY"],
      },
    });

    const data = await response.json();

    console.log(data);
    // res.locals.dashboard = data;

    next();
  } else {
    next();
  }
};

module.exports.monoReauth = async (req, res, next) => {
  const query = {
    monoId: req.body.id,
  };

  const result = {
    $set: {
      monoStatus: true,
    },
  };

  await User.updateOne(query, result, { new: true }, function (err, res) {});

  res.status(201).json({ status: "redirect" });
};
