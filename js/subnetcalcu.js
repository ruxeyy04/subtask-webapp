$(document).ready(function () {
  $("#ipaddress").on("input", function () {
    // Remove non-numeric characters from the input
    var cleanedInput = $(this)
      .val()
      .replace(/[^0-9.]/g, "");

    // Update the input field with the cleaned input
    $(this).val(cleanedInput);

    // Split the IP address into octets
    var octets = cleanedInput.split(".");

    // Determine the IP address class based on the first octet
    if (octets.length >= 1 && octets[0] >= 1 && octets[0] <= 126) {
      $("#network-class").val("A");
      $("#slashformat").val("/8");
    } else if (octets.length >= 1 && octets[0] >= 128 && octets[0] <= 191) {
      $("#network-class").val("B");
      $("#slashformat").val("/16");
    } else if (octets.length >= 1 && octets[0] >= 192 && octets[0] <= 223) {
      $("#network-class").val("C");
      $("#slashformat").val("/24");
    } else {
      $("#network-class").val("");
      $("#slashformat").val("");
    }
  });
  $("#network-class").prop("disabled", true);
  var cidrrr = "";
  $("#calculate").click(function () {
    var ipAddress = $("#ipaddress").val();
    if (ipAddress.trim() === "") {
      toast.fire({
        icon: "error",
        title: "There is no IP Address",
      });
      return;
    }
    if (/^127\./.test(ipAddress) || /^0\./.test(ipAddress)) {
      toast.fire({
        icon: "info",
        title:
          "Reserved IP address for special purposes. Please enter a valid IP address.",
      });
      return;
    }
    if (!isValidIpAddress(ipAddress)) {
      toast.fire({
        icon: "error",
        title: "Ivalid IP Address",
      });
      return;
    }
    var isChecked = $("input[name='inlineRadioOptions']:checked").length > 0;

    if (!isChecked) {
      toast.fire({
        icon: "error",
        title: "Please select an option to calculate",
      });
      return;
    }
    var selectedValue = $("input[name='inlineRadioOptions']:checked").val();
    if (selectedValue === "slashformat") {
      var ipAddress = $("#solveslashformat").val();
      if (ipAddress === "") {
        toast.fire({
          icon: "error",
          title: "There is no value in required slash format field",
        });
        return;
      }
      var slashFormatInput = $("#slashformat").val().replace("/", "");
      var solveslashformatInput = $("#solveslashformat").val().replace("/", "");
      var slashFormat = parseInt(solveslashformatInput);
      var borrowedBits = solveslashformatInput - slashFormatInput;
      var usableSubnets = Math.pow(2, borrowedBits) - 2;
      var newSubnetMask = calculateSubnetMask(solveslashformatInput);

      var cidr = getCIDR(newSubnetMask);
      var ipBinary = convertDecimalToBinary($("#ipaddress").val());
      var subnetMaskBinary = convertDecimalToBinary(newSubnetMask);
      var deltaValue = calculateDelta(cidr);
      var usableHosts = Math.pow(2, 32 - solveslashformatInput) - 2;
      $("#borrowedBits").text("Borrowed Bits: " + borrowedBits);
      $("#slashFormatResult").text(
        "Slash Format: " + "/" + solveslashformatInput
      );
      $("#usableSubnets").text(
        "Usable Subnets: " + usableSubnets.toLocaleString()
      );
      $("#delta").text("Delta: " + deltaValue);
      $("#newSubnetMask").text("Subnet Mask: " + newSubnetMask);
      $("#usableHostsResult").text(
        "Usable Hosts/Subnet: " + usableHosts.toLocaleString()
      );
      $("#ipbinary").text("IP Binary: " + ipBinary);
      $("#subnetmaskbinary").text("Subnet Mask Binary: " + subnetMaskBinary);
    } else if (selectedValue === "requiredsubnet") {
      var ipAddress = $("#requiredsubnet").val();
      if (ipAddress === "") {
        toast.fire({
          icon: "error",
          title: "There is no value in required usable subnet field",
        });
        return;
      }
      var slashFormatInput = $("#slashformat").val().replace("/", "");
      var borrowedbits = calculateBorrowedBits($("#requiredsubnet").val());
      let usableSubnets = Math.pow(2, borrowedbits) - 2;
      let slashFormat = parseInt(slashFormatInput) + parseInt(borrowedbits);
      var newSubnetMask = calculateSubnetMask(slashFormat);
      var usableHosts = Math.pow(2, 32 - slashFormat) - 2;
      var cidr = getCIDR(newSubnetMask);
      var ipBinary = convertDecimalToBinary($("#ipaddress").val());
      var subnetMaskBinary = convertDecimalToBinary(newSubnetMask);
      var deltaValue = calculateDelta(cidr);
      $("#borrowedBits").text("Borrowed Bits: " + borrowedbits);
      $("#usableSubnets").text(
        "Usable Subnets: " + usableSubnets.toLocaleString()
      );
      $("#slashFormatResult").text(
        "Slash Format: /" + slashFormat.toLocaleString()
      );
      $("#newSubnetMask").text("Subnet Mask: " + newSubnetMask);
      $("#usableHostsResult").text("Usable Hosts/Subnet: " + usableHosts);
      $("#delta").text("Delta: " + deltaValue);
      $("#ipbinary").text("IP Binary: " + ipBinary);
      $("#subnetmaskbinary").text("Subnet Mask Binary: " + subnetMaskBinary);
    } else {
      var ipAddress = $("#usablehostsubnet").val();
      if (ipAddress === "") {
        toast.fire({
          icon: "error",
          title: "There is no value in required usable host/subnet field",
        });
        return;
      }
      var slashFormatInput = $("#slashformat").val().replace("/", "");
      var numberofHostBits = calculateBorrowedBits(
        $("#usablehostsubnet").val()
      );
      let usableHosts = Math.pow(2, numberofHostBits) - 2;
      let slashFormat = 32 - parseInt(numberofHostBits);
      var newSubnetMask = calculateSubnetMask(slashFormat);
      var borrowedbits = parseInt(slashFormat) - parseInt(slashFormatInput);
      let usableSubnets = Math.pow(2, borrowedbits) - 2;
      var cidr = getCIDR(newSubnetMask);
      var ipBinary = convertDecimalToBinary($("#ipaddress").val());
      var subnetMaskBinary = convertDecimalToBinary(newSubnetMask);
      var deltaValue = calculateDelta(cidr);
      $("#usableHostsResult").text(
        "Usable Hosts/Subnet: " + usableHosts.toLocaleString()
      );
      $("#slashFormatResult").text("Slash Format: /" + slashFormat);
      $("#newSubnetMask").text("Subnet Mask: " + newSubnetMask);
      $("#borrowedBits").text("Borrowed Bits: " + borrowedbits);
      $("#usableSubnets").text(
        "Usable Subnets: " + usableSubnets.toLocaleString()
      );
      $("#delta").text("Delta: " + deltaValue);
      $("#ipbinary").text("IP Binary: " + ipBinary);
      $("#subnetmaskbinary").text("Subnet Mask Binary: " + subnetMaskBinary);
    }

    let delta = parseInt($("#delta").text().match(/\d+/)[0]);
    var prefix = parseInt($("#slashFormatResult").text().match(/\d+/)[0]);
    let subnets = parseInt(
      $("#usableSubnets")
        .text()
        .match(/[\d,]+/g)
        .map(function (number) {
          return number.replace(/,/g, "");
        })
    );
    subnettable($("#ipaddress").val(), delta, subnets, prefix);
  });
  function subnettable(ip, delta, subnets, prefix) {
    $('#subnetTableBody').empty();
    // Convert IP address to an array of integers
    let ipParts = ip.split(".").map(Number);
    let subnetcount;
    if (subnets <= 10) {
      subnetcount = subnets;
    } else {
      subnetcount = 10;
    }
    // Calculate and log IP addresses for each subnet
    for (let i = 0; i < subnetcount; i++) {
      let octetIndex;
      if (prefix >= 9 && prefix <= 16) {
        octetIndex = 2 - 1; // Increment the 2nd octet for /9 to /16
      } else if (prefix >= 17 && prefix <= 24) {
        octetIndex = 3 - 1; // Increment the 3rd octet for /17 to /24
      } else if (prefix >= 25 && prefix <= 30) {
        octetIndex = 4 - 1; // Increment the 4th octet for /25 to /30
      }

      // Increment the specified octet by the delta value
      ipParts[octetIndex] += delta;

      // Handle carryover to the preceding octets if necessary
      for (let j = octetIndex; j >= 0; j--) {
        if (ipParts[j] > 255) {
          ipParts[j - 1] += Math.floor(ipParts[j] / 256);
          ipParts[j] %= 256;
        } else {
          break; // No more carryover needed
        }
      }

      // Calculate the host range and broadcast address
      let hostRangeStart = ipParts.slice();
      let hostRangeEnd = ipParts.slice();
      let broadcastAddress = ipParts.slice();
      hostRangeStart[3]++; // Increment the last octet for host range start

      if (prefix >= 9 && prefix <= 16) {
        hostRangeEnd[1] += delta - 1; // Increment the last octet for host range end
        hostRangeEnd[2] += 255;
        hostRangeEnd[3] += 254;
        broadcastAddress[1] += delta - 1;
        broadcastAddress[2] += 255;
        broadcastAddress[3] += 255;
      } else if (prefix >= 17 && prefix <= 24) {
        hostRangeEnd[2] += delta - 1; // Increment the last octet for host range end
        hostRangeEnd[3] += 254;
        broadcastAddress[2] += delta - 1;
        broadcastAddress[3] += 255;
      } else if (prefix >= 25 && prefix <= 30) {
        hostRangeEnd[3] += delta - 2;
        broadcastAddress[3] += delta - 1;
      }

      // Format the new IP address, host range, and broadcast address
      let newIp = ipParts.join(".");
      let hostRangeStartIp = hostRangeStart.join(".");
      let hostRangeEndIp = hostRangeEnd.join(".");
      let broadcastIp = broadcastAddress.join(".");
      $('#subnetTableBody').append(`
      <tr>
        <td>${i + 1}</td>
        <td>${newIp}</td>
        <td>${hostRangeStartIp} - ${hostRangeEndIp}</td>
        <td>${broadcastIp}</td>
      </tr>
      `)


    }

    if (subnets >= 11) {
      $('#subnetTableBody').append(`
      <tr>
        <td colspan="4">
        <div class="container mt-4">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <form id="subnetaddressget">
              <div class="mb-3">
                <label for="subnetInput" class="form-label">Input Subnet # to show IP Addresses</label>
                <input type="hidden" id="ipaddresssss" value="${ip}">
                <input type="hidden" id="deltaaa" value="${delta}">
                <input type="hidden" id="prefixxxx" value="${prefix}">
                <input type="number" id="subnetInput" name="subnetInput" min="11" max="${subnets}" class="form-control" placeholder="Subnet 11 to ${subnets} only" required>
              </div>
              <button type="submit" class="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>
      
        
        </td>
      </tr>
      `)
    }
  }
$(document).on('submit', '#subnetaddressget', function (e) {
  e.preventDefault()
  let delta = parseInt($('#deltaaa').val());
  let prefix = parseInt($('#prefixxxx').val());
  let requestedSubnet = parseInt($('#subnetInput').val());
  let ipParts = $('#ipaddresssss').val().split(".").map(Number);
  var subnetExists = false;
  $("#subnetTableBody tr").each(function() {
    var subnetNumber = parseInt($(this).find("td:first").text().replace(/,/g, ''));
    if (subnetNumber === requestedSubnet) {
      subnetExists = true;
      return false; // Exit the .each() loop
    }
  });
  if (subnetExists) {
    toast.fire({
      icon: "info",
      title: `The Subnet ${requestedSubnet.toLocaleString()} is already exist in the table`,
    });
    return; // Exit the surrounding function or further processing
  }
  if (!requestedSubnet == "") {
    let octetIndex;
    if (prefix >= 9 && prefix <= 16) {
      octetIndex = 2 - 1; // Increment the 2nd octet for /9 to /16
    } else if (prefix >= 17 && prefix <= 24) {
      octetIndex = 3 - 1; // Increment the 3rd octet for /17 to /24
    } else if (prefix >= 25 && prefix <= 30) {
      octetIndex = 4 - 1; // Increment the 4th octet for /25 to /30
    }

    // Increment the specified octet by the delta value
    ipParts[octetIndex] += delta * requestedSubnet;

    // Handle carryover to the preceding octets if necessary
    for (let j = octetIndex; j >= 0; j--) {
      if (ipParts[j] > 255) {
        ipParts[j - 1] += Math.floor(ipParts[j] / 256);
        ipParts[j] %= 256;
      } else {
        break; // No more carryover needed
      }
    }

    // Calculate the host range and broadcast address
    let hostRangeStart = ipParts.slice();
    let hostRangeEnd = ipParts.slice();
    let broadcastAddress = ipParts.slice();
    hostRangeStart[3]++; // Increment the last octet for host range start

    if (prefix >= 9 && prefix <= 16) {
      hostRangeEnd[1] += delta - 1; // Increment the last octet for host range end
      hostRangeEnd[2] += 255;
      hostRangeEnd[3] += 254;
      broadcastAddress[1] += delta - 1;
      broadcastAddress[2] += 255;
      broadcastAddress[3] += 255;
    } else if (prefix >= 17 && prefix <= 24) {
      hostRangeEnd[2] += delta - 1; // Increment the last octet for host range end
      hostRangeEnd[3] += 254;
      broadcastAddress[2] += delta - 1;
      broadcastAddress[3] += 255;
    } else if (prefix >= 25 && prefix <= 30) {
      hostRangeEnd[3] += delta - 2;
      broadcastAddress[3] += delta - 1;
    }

    // Format the new IP address, host range, and broadcast address
    let newIp = ipParts.join(".");
    let hostRangeStartIp = hostRangeStart.join(".");
    let hostRangeEndIp = hostRangeEnd.join(".");
    let broadcastIp = broadcastAddress.join(".");


      $('#subnetTableBody').append(`
      <tr>
        <td>${requestedSubnet.toLocaleString()}</td>
        <td>${newIp}</td>
        <td>${hostRangeStartIp} - ${hostRangeEndIp}</td>
        <td>${broadcastIp}</td>
      </tr>
      `)

  }
})
  function isValidIpAddress(ipAddress) {
    var ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return ipRegex.test(ipAddress);
  }
  function calculateBorrowedBits(requiredSubnet) {
    let bits = 0;
    while (Math.pow(2, bits) < requiredSubnet) {
      bits++;
    }
    return bits;
  }
  function calculateSubnetMask(cidr) {
    var subnetMask = [];

    for (var i = 0; i < 4; i++) {
      if (cidr >= 8) {
        subnetMask.push(255);
        cidr -= 8;
      } else {
        var octet = 0;
        for (var j = 7; j >= 8 - cidr; j--) {
          octet += Math.pow(2, j);
        }
        subnetMask.push(octet);
        cidr = 0;
      }
    }

    return subnetMask.join(".");
  }
  function getCIDR(subnetMask) {
    var octets = subnetMask.split(".");
    var extractedValue = null;

    for (var i = 0; i < octets.length; i++) {
      var octet = parseInt(octets[i]);
      if (octet !== 255) {
        extractedValue = octet;
        break; // Stop after finding the first non-255 octet
      }
    }

    return extractedValue;
  }
  function calculateDelta(cidr) {
    if (cidr === 128) {
      return 128;
    } else if (cidr === 192) {
      return 64;
    } else if (cidr === 224) {
      return 32;
    } else if (cidr === 240) {
      return 16;
    } else if (cidr === 248) {
      return 8;
    } else if (cidr === 252) {
      return 4;
    } else if (cidr === 254) {
      return 2;
    } else {
      return 1;
    }
  }
  function convertDecimalToBinary(ipDecimal) {
    var ipParts = ipDecimal.split(".");
    var ipBinary = ipParts.map(function (part) {
      return (+part).toString(2).padStart(8, "0");
    });
    return ipBinary.join(".");
  }
  $("#clear").click(function () {
    $("#borrowedBits").empty();
    $("#slashFormatResult").empty();
    $("#usableSubnets").empty();
    $("#delta").empty();
    $("#newSubnetMask").empty();
    $("#usableHostsResult").empty();
    $("#ipbinary").empty();
    $("#subnetmaskbinary").empty();
  });
});
$(document).ready(function () {
  $("#clear").click(function () {
    $('#subnetTableBody').empty()
    // Clear input fields
    $("#ipaddress").val("");
    $("#slashformat").val("");
    $("#subnet-input input").val("");
    $("#usablesubnet-input input").val("");
    $("#slashformat-input input").val("");
    $("#network-class").val("");
    // Deselect radio buttons
    $("input[name='inlineRadioOptions']").prop("checked", false);
    $("#subnet-input").hide();
    $("#usablesubnet-input").hide();
    $("#slashformat-input").hide();
  });

  $("#subnet-input").hide();
  $("#usablesubnet-input").hide();
  $("#slashformat-input").hide();
  // Attach a change event handler to the radio buttons
  $("#network-class").change(function () {
    var netclass = $(this).val();
    if (netclass === "A") {
      $("#slashformat").val("/8");
    } else if (netclass === "B") {
      $("#slashformat").val("/16");
    } else {
      $("#slashformat").val("/24");
    }
  });
  $("input[name='inlineRadioOptions']").change(function () {
    // Check which radio button is selected
    var selectedValue = $("input[name='inlineRadioOptions']:checked").val();

    // Check the selected value and display the input field accordingly
    if (selectedValue === "requiredsubnet") {
      // Display the input field for "Required Subnet"
      $("#subnet-input").show();
      $("#usablesubnet-input").hide();
      $("#slashformat-input").hide();
      $("#borrowedBits").empty();
      $("#slashFormatResult").empty();
      $("#usableSubnets").empty();
      $("#delta").empty();
      $("#newSubnetMask").empty();
      $("#usableHostsResult").empty();
      $("#ipbinary").empty();
      $("#subnetmaskbinary").empty();
      $('#subnetTableBody').empty()
    } else if (selectedValue === "requiredusablesubnet") {
      // Display the input field for "Required Usable/Subnet"
      $("#subnet-input").hide();
      $("#usablesubnet-input").show();
      $("#slashformat-input").hide();
      $("#borrowedBits").empty();
      $("#slashFormatResult").empty();
      $("#usableSubnets").empty();
      $("#delta").empty();
      $("#newSubnetMask").empty();
      $("#usableHostsResult").empty();
      $("#ipbinary").empty();
      $("#subnetmaskbinary").empty();
      $('#subnetTableBody').empty()
    } else if (selectedValue === "slashformat") {
      // Display the input field for "Solve Slash Format"
      $("#subnet-input").hide();
      $("#usablesubnet-input").hide();
      $("#slashformat-input").show();
      $("#borrowedBits").empty();
      $("#slashFormatResult").empty();
      $("#usableSubnets").empty();
      $("#delta").empty();
      $("#newSubnetMask").empty();
      $("#usableHostsResult").empty();
      $("#ipbinary").empty();
      $("#subnetmaskbinary").empty();
      $('#subnetTableBody').empty()
    }
  });
});



