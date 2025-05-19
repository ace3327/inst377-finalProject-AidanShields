async function loadDepartments() {
  const res = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/departments');
  const data = await res.json();
  const select = document.getElementById('department');
  data.departments.forEach(dept => {
    const option = document.createElement('option');
    option.value = dept.departmentId;
    option.textContent = dept.displayName;
    select.appendChild(option);
  });
}

document.getElementById('search-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = document.getElementById('query').value;
  const department = document.getElementById('department').value;
  const dateStart = document.getElementById('date-start').value;
  const dateEnd = document.getElementById('date-end').value;
  const medium = document.getElementById('medium').value;

  const searchParams = new URLSearchParams({ q: query });
  if (department) searchParams.append('departmentId', department);
  if (dateStart) searchParams.append('dateBegin', dateStart);
  if (dateEnd) searchParams.append('dateEnd', dateEnd);

  const res = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?${searchParams.toString()}`);
  const data = await res.json();
  const objectIDs = data.objectIDs ? data.objectIDs.slice(0, 20) : [];

  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';

  const promises = objectIDs.map(id =>
    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`).then(res => res.json())
  );
  const objects = await Promise.all(promises);

  objects.forEach(obj => {
    if (!obj.primaryImage) return;

    if (!medium || obj.medium.toLowerCase().includes(medium.toLowerCase())) {
      const div = document.createElement('div');
      div.classList.add('art-card');
      div.innerHTML = `
        <img src="${obj.primaryImage}" alt="${obj.title}" />
        <h3>${obj.title}</h3>
        <p><strong>Artist:</strong> ${obj.artistDisplayName || 'Unknown'}</p>
        <p><strong>Date:</strong> ${obj.objectDate}</p>
        <p><strong>Medium:</strong> ${obj.medium}</p>
      `;
      resultsContainer.appendChild(div);
    }
  });

  await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, department, dateStart, dateEnd, medium })
  });

  loadChart();
});

async function loadChart() {
  const res = await fetch('/api/searches');
  const data = await res.json();
  const labels = data.map(d => d.query);
  const counts = Object.values(labels.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {}));

  const uniqueLabels = [...new Set(labels)];

  const ctx = document.getElementById('searchChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: uniqueLabels,
      datasets: [{
        label: 'Search Frequency',
        data: counts,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

loadDepartments();