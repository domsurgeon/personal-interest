const ENDAGE = 89;
const ENDDEXP = 79;
const MIDAGE = 40;
// const lrate = 0.5;
const maxIter = 2000
  const ageEl = document.getElementById("age");
  const outflowEl = document.getElementById("outflow");
  const savingsEl = document.getElementById("savings");
  const wageEl = document.getElementById("wage");
  const ageendEl = document.getElementById("ageend");
  const interestEl = document.getElementById("interest");
  const endcapitalEl = document.getElementById("endcapital");
  const resultEl = document.getElementById("result");
  const result2El = document.getElementById("result-interest");
  const result3El = document.getElementById("result-ages");

function getResult(testInterest) {

  const age = ageEl.value * 1;
  const outflow = outflowEl.value * 1;
  const outflowYear = outflow * 12;
  const savings = savingsEl.value * 1;
  const wage = wageEl.value * 1;
  const ageend = ageendEl.value * 1;
  const endcapital = endcapitalEl.value * 1;
  const interestVal = interestEl.value * 1;

  const arrAge = new Array(ENDAGE - age).fill(0).map((v, i) => age + i);
  const arrAnualExpense = arrAge.map((a) => ({
    age: a,
    exp: outflowYear * (a < MIDAGE || a > ENDDEXP ? 1 : 2),
  }));

  const altInterest = 1;

  let interest = testInterest ? interestVal : altInterest;

  let tmpEndCap = 0;
  let lastCapital = 0;
  let c = 0;
  let arrSavings = [];
  let prevInterest = interest;
  let lastWasUp = "no";

  if (!testInterest) {
    while (tmpEndCap !== endcapital) {
      tmpEndCap = endCapFromInterest(interest);

      if (Math.abs(tmpEndCap - endcapital) <= maxIter || interest === 0) {
        // ends
        if (Math.abs(tmpEndCap - endcapital) <= maxIter) {
          let whileCap = tmpEndCap;
          let prevWhileCap = tmpEndCap;
          let whileInterest = interest;
          let prevWhileInterest = interest;

          while (Math.abs(whileCap - endcapital) <= maxIter) {
            prevWhileInterest = whileInterest;
            prevWhileCap = whileCap;
            whileInterest = Number(`${whileInterest}`.slice(0, -1));
            whileCap = endCapFromInterest(whileInterest);
          }
          interest = prevWhileInterest;
          tmpEndCap = prevWhileCap;
        }

        lastCapital = tmpEndCap;
        tmpEndCap = endcapital;
      } else {
        interest = recalc(tmpEndCap);
      }

      if (c > maxIter) {
        interest = 0;
      }
      c++;
    }
    resultEl.innerHTML = `Interest needed: ${
      (interest * 100)
    }% - End capital: $${lastCapital}`;

    interestEl.value = interest;

    console.log("ajustes", c);
  } else {
    lastCapital = endCapFromInterest(interest);
    result2El.innerHTML = `Interest needed: ${
      (interest * 100)
    }% - End capital: $${lastCapital}`;
  }

  result3El.innerHTML = "";
  const max = Math.max(...arrSavings);
  arrAge.forEach(
    (a, i) =>
      (result3El.innerHTML += `<h3 class="${
        max === arrSavings[i] ? "max" : ""
      }">Beginning age ${a} will have savings: $${arrSavings[i].toFixed()}<br />
      ${a !== age && wage && age + i - 1 < ageend ? `${wage * 12} (wages) + ` : ""}
      ${Math.round(arrSavings[i - 1] * interest) || 0} (interests) - ${
        arrAnualExpense[i - 1]?.exp || 0
      } (expenses) == ${
        (Math.round(arrSavings[i - 1] * interest) || 0) +
        (a !== age && wage && age + i - 1 < ageend ? wage * 12 : 0) -
        (arrAnualExpense[i - 1]?.exp || 0)
      } (save)</h3>${
        i === arrAge.length - 1
          ? `<h3>Beginning age ${
              a + 1
            } will have savings: $${lastCapital.toFixed()}</h3>`
          : ""
      }`)
  );

  function endCapFromInterest(inter) {
    arrSavings = [savings];
    const endCap = arrAnualExpense.reduce((acc, aE, i) => {
      const wag = ageend && aE.age <= ageend ? wage * 12 : 0;
      const inte = Math.max(acc * inter, 0);
      const total = acc + wag + inte - aE.exp;

      arrSavings.push(total);
      return total;
    }, savings);

    return Math.round(endCap);
  }

  function recalc(tmp) {
    const nowIsUp = tmp < endcapital;
    let inter =
      lastWasUp !== "no" && ((nowIsUp && !lastWasUp) || (!nowIsUp && lastWasUp))
        ? (prevInterest + interest) / 2
        : nowIsUp
        ? augment(interest)
        : decrease(interest);

    prevInterest = interest;
    lastWasUp = nowIsUp;

    return inter;
  }
  function augment(inter) {
    return inter + inter / 2;
  }

  function decrease(inter) {
    return inter - inter / 2;
  }

  if(!testInterest){
    getResult(true)
  }
}
