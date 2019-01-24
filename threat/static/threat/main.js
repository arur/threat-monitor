(function() {
  // state variables
  let threats, period, order;

  // map the options to period in days
  const periodInDays = {
    day: 1,
    week: 7,
    month: 28
  };

  let rating = ["clean", "low-risk", "medium-risk", "high-risk", "malicious"];

  // run onload
  $(function() {
    // Load data initialy
    getThreats(data => {
      threats = normalizeData(data);
      renderTbody(threats, $("#period").val());
    });

    // Reload data on reload button click
    $("#reload").on("click", function() {
      getThreats(data => {
        threats = normalizeData(data);
        $(".order-by").removeClass("field");
        renderTbody(threats, $("#period").val());
      });
    });

    // Filter data based on period dropdown option
    $("#period").change(function() {
      period = $(this).val();
      renderTbody(threats, period);
    });

    // Set order state variable based on column clicked
    $(".order-by").on("click", function() {
      order = $(this).attr("id").slice(6);
      $(".order-by").removeClass("field")
      $(this).addClass("field");

      // rerender the table
      renderTbody(threats, period);
    });
  });

  //
  // Helper functions
  //

  // is the given date within the period provided
  function isWithinRange(date, period) {
    const currentDate = new Date();

    return (
      dateFns.isBefore(date, currentDate) &&
      dateFns.differenceInDays(currentDate, date) <= periodInDays[period]
    );
  }

  // render new table body with data provided
  function renderTbody(threats, period = "day") {
    // sort by corresponding column
    threats = _.sortBy(threats, [
      function(t) {
        if (order === "rating") {
          return rating.indexOf(t[order]);
        }
        return t[order];
      }
    ]);

    // iterate over array and reduce to html string
    let tbody = threats.reduce((str, threat) => {
      // include only threats that are within the period
      if (isWithinRange(threat.date, period)) {

        // consruct html for a row
        str += `<tr class="${threat.rating}">
          <td>${threat.filename}</td>
          <td>${dateFns.format(threat.date, "MMM DD, YYYY HH:mm")}</td>
          <td>${threat.action}</td>
          <td>${threat["submit-type"]}</td>
          <td>${threat.rating}</td>
          </tr>`;
      }
      return str;
    }, '<tbody class="threats">');

    // append closing tag
    tbody += "</tbody>";

    // attach to DOM
    $(".threats").replaceWith(tbody);
  }

  // Ajax request to api
  function getThreats(onSuccess) {
    $.ajax({
      url: "api/data/",
      success: onSuccess
    });
  }

  // normalises data
  function normalizeData(data) {
    // convert date string to Date object
    return data.map(({ date, ...t }) => ({ date: new Date(date), ...t }));
  }
})();
