    const splitters = {
      "1x2": 4,
      "1x4": 7,
      "1x8": 10,
      "1x16": 13
    };

    function calculateLoss(path) {
      return path.reduce((sum, s) => sum + splitters[s], 0);
    }

    function outputPower(sourcePower, path) {
      return sourcePower - calculateLoss(path);
    }

    function findFeasibleTopologies(sourcePower, clients, threshold) {
      const splitterKeys = Object.keys(splitters);
      const maxDepth = 3;
      const feasible = [];

      function generatePaths(depth, path = []) {
        if (depth === 0) return [path];
        let result = [];
        for (const splitter of splitterKeys) {
          result = result.concat(generatePaths(depth - 1, path.concat(splitter)));
        }
        return result;
      }

      for (let depth = 1; depth <= maxDepth; depth++) {
        const combos = generatePaths(depth);
        for (const combo of combos) {
          let totalOutputs = combo.reduce((acc, s) => acc * parseInt(s.split("x")[1]), 1);
          if (totalOutputs >= clients) {
            let power = outputPower(sourcePower, combo);
            if (power >= threshold) {
              feasible.push({
                topology: combo,
                clientsSupported: totalOutputs,
                powerPerClient: power.toFixed(2)
              });
            }
          }
        }
      }
      return feasible;
    }

    function findTopologies() {
      const sourcePower = parseFloat(document.getElementById("sourcePower").value);
      const clients = parseInt(document.getElementById("clients").value);
      const threshold = parseFloat(document.getElementById("threshold").value);

      const results = findFeasibleTopologies(sourcePower, clients, threshold);
      const resultsDiv = document.getElementById("results");
      resultsDiv.innerHTML = "";

      if (results.length > 0) {
        results.forEach(r => {
          const item = document.createElement("div");
          item.innerHTML = `Topology: ${r.topology.join(" → ")} | Clients: ${r.clientsSupported} | Output: ${r.powerPerClient} dB`;
          resultsDiv.appendChild(item);
        });
      } else {
        resultsDiv.innerHTML = "<em>No feasible topology found.</em>";
      }
    }
