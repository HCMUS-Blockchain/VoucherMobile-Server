const dayjs = require("dayjs");
const Campaign = require("../models/campaign");
const Userjoin = require("../models/userjoin");
const Voucher = require("../models/voucher");

function getDate(option) {
  let firstDateBegin, firstDateEnd, secondDateBegin, secondDateEnd;
  if (option === "today") {
    firstDateBegin = dayjs().set("hour", 0).set("minute", 0).set("second", 0);
    firstDateEnd = dayjs().set("hour", 23).set("minute", 59).set("second", 59);

    secondDateBegin = dayjs()
      .set("date", dayjs().get("date") - 1)
      .set("hour", 0)
      .set("minute", 0)
      .set("second", 0);
    secondDateEnd = dayjs()
      .set("date", dayjs().get("date") - 1)
      .set("hour", 23)
      .set("minute", 59)
      .set("second", 59);
  } else if (option === "week") {
    let temp = dayjs().get("date") - dayjs().day() + 1;
    firstDateBegin = dayjs()
      .set("date", temp + 1)
      .set("hour", 0)
      .set("minute", 0)
      .set("second", 0);
    firstDateEnd = dayjs()
      .set("date", temp + 6)
      .set("hour", 23)
      .set("minute", 59)
      .set("second", 59);

    temp = dayjs().get("date") - 7 - dayjs().day() + 1;
    secondDateBegin = dayjs()
      .set("date", temp + 1)
      .set("hour", 0)
      .set("minute", 0)
      .set("second", 0);
    secondDateEnd = dayjs()
      .set("date", temp + 6)
      .set("hour", 23)
      .set("minute", 59)
      .set("second", 59);
  } else if (option == "month") {
    firstDateBegin = dayjs()
      .set("date", 1)
      .set("month", dayjs().get("month"))
      .set("hour", 0)
      .set("minute", 0)
      .set("second", 0);
    firstDateEnd = dayjs()
      .set("date", 31)
      .set("month", dayjs().get("month"))
      .set("hour", 23)
      .set("minute", 59)
      .set("second", 59);

    secondDateBegin = dayjs()
      .set("date", 1)
      .set("month", dayjs().get("month") - 1)
      .set("hour", 0)
      .set("minute", 0)
      .set("second", 0);
    secondDateEnd = dayjs()
      .set("date", 31)
      .set("month", dayjs().get("month") - 1)
      .set("hour", 23)
      .set("minute", 59)
      .set("second", 59);
  } else if (option == "year") {
    firstDateBegin = dayjs()
      .set("date", 1)
      .set("month", 0)
      .set("hour", 0)
      .set("minute", 0)
      .set("second", 0);
    firstDateEnd = dayjs()
      .set("date", 31)
      .set("month", 11)
      .set("hour", 23)
      .set("minute", 59)
      .set("second", 59);

    secondDateBegin = dayjs()
      .set("date", 1)
      .set("month", 0)
      .set("year", dayjs().get("year") - 1)
      .set("hour", 0)
      .set("minute", 0)
      .set("second", 0);
    secondDateEnd = dayjs()
      .set("date", 31)
      .set("month", 11)
      .set("year", dayjs().get("year") - 1)
      .set("hour", 23)
      .set("minute", 59)
      .set("second", 59);
  }
  return [firstDateBegin, firstDateEnd, secondDateBegin, secondDateEnd];
}

function getResult(a, b) {
  if (b === 0) return a * 100;
  else if (a === 0) return b * -100;
  const temp = ((b - a) / a) * 100;
  if (Number.isInteger(temp)) {
    return temp;
  }
  return temp.toPrecision(2);
}

const templateData = [
  {
    label: "Campaigns",
    description: "Total campaigns which you created",
  },
  {
    label: "Customers",
    description: "Total customer who participated in",
  },
  {
    label: "Release Vouchers",
    description: "Total vouchers which users got ",
  },
  {
    label: "Used Vouchers",
    description: "Total vouchers which users used ",
  },
];

async function getTotalCampaign(option, userID) {
  const [firstDateBegin, firstDateEnd, secondDateBegin, secondDateEnd] =
    getDate(option);
  const currentCampaign = await Campaign.find({
    $and: [
      { userID: userID },
      { createdAt: { $gte: firstDateBegin, $lt: firstDateEnd } },
    ],
  }).count();

  const pastCampaign = await Campaign.find({
    $and: [
      { userID: userID },
      { createdAt: { $gte: secondDateBegin, $lt: secondDateEnd } },
    ],
  }).count();

  const result = getResult(currentCampaign, pastCampaign);
  return { value: currentCampaign, percentage: result };
}

async function getTotalVoucher(option, userID, available) {
  const [firstDateBegin, firstDateEnd, secondDateBegin, secondDateEnd] =
    getDate(option);
  const listCampaign = await Campaign.find({ userID: userID });
  const campaignListID = listCampaign.map((item) => item._id);
  const currentVoucherList = await Voucher.find({
    $and: [
      { campaign: campaignListID },
      { available: available },
      { timeGet: { $gte: firstDateBegin, $lt: firstDateEnd } },
    ],
  }).count();

  const pastVoucherList = await Voucher.find({
    $and: [
      { campaign: campaignListID },
      { available: available },
      { timeGet: { $gte: secondDateBegin, $lt: secondDateEnd } },
    ],
  }).count();

  const result = getResult(currentVoucherList, pastVoucherList);
  return { value: currentVoucherList, percentage: result };
}

async function getCustomer(option, userID) {
  const [firstDateBegin, firstDateEnd, secondDateBegin, secondDateEnd] =
    getDate(option);
  const listCampaignID = await Campaign.find({ userID: userID });
  const currentListUser = await Userjoin.find({
    $and: [
      { campaignID: listCampaignID },
      { createdAt: { $gte: firstDateBegin, $lt: firstDateEnd } },
    ],
  }).count();

  const pastListUser = await Userjoin.find({
    $and: [
      { campaignID: listCampaignID },
      { createdAt: { $gte: secondDateBegin, $lt: secondDateEnd } },
    ],
  }).count();

  const result = getResult(currentListUser, pastListUser);
  return { value: currentListUser, percentage: result };
}
exports.getGeneralStatistic = async (req, res) => {
  try {
    const option = req.params.option;
    let campaignResult, customerResult, releaseResult, usedResult;
    usedResult = await getTotalVoucher(option, req.user._id, false);
    releaseResult = await getTotalVoucher(option, req.user._id, true);
    campaignResult = await getTotalCampaign(option, req.user._id);
    customerResult = await getCustomer(option, req.user._id);

    for (const element of templateData) {
      if (element.label === "Campaigns") {
        element.value = campaignResult.value;
        element.percentage = campaignResult.percentage;
      } else if (element.label === "Customers") {
        element.value = customerResult.value;
        element.percentage = customerResult.percentage;
      } else if (element.label === "Release Vouchers") {
        element.value = releaseResult.value;
        element.percentage = releaseResult.percentage;
      } else if (element.label === "Used Vouchers") {
        element.value = usedResult.value;
        element.percentage = usedResult.percentage;
      }
    }
    res.status(201).send({
      result: templateData,
      success: true,
      message: "Voucher created successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({ success: false, message: e.message });
  }
};

function filterDate(list, a, b) {
  const temp = list.map((item) => item.createdAt);
  const startDate = new Date(a);
  const endDate = new Date(b);
  let result = {};
  for (var d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    result[dayjs(d).format("DD/MM/YYYY")] = 0;
  }

  for (element of temp) {
    const day = dayjs(element).format("DD/MM/YYYY");
    if (result[day] >= 0) {
      result[day] += 1;
    }
  }
  return result;
}
exports.getVoucherStatistic = async (req, res) => {
  try {
    const list = await Voucher.find({
      $and: [
        { campaign: req.body.option },
        { createAt: { $gte: req.body.startDate, $lt: req.body.endDate } },
      ],
    });

    console.log(filterDate(list, req.body.startDate, req.body.endDate));

    // for (let i = req.body.startDate; i < req.body.endDate; i++) {
    //   console.log(dayjs(i).format("DD/MM/YYYY"));
    // }
  } catch (e) {
    console.log(e);
    res.status(400).send({ success: false, message: e.message });
  }
  console.log(req.body);
};
