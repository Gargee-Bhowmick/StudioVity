const document = (characters)=>{
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Character Report</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
          color: #333;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        h1 {
          text-align: center;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Character Report</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Occupation</th>
              <th>Relations</th>
              <th>Photos</th>
            </tr>
          </thead>
          <tbody>
            <!-- Looping through characters and populating the rows -->
            ${characters.map(character => `
            <tr>
              <td>${character.name}</td>
              <td>${character.age}</td>
              <td>${character.gender}</td>
              <td>${character.occupation}</td>
              <td>${character.relations.join(', ')}</td>
              <td>${character.photos.join(', ')}</td>
            </tr>`).join('')}
        </table>
      </div>
    </body>
    </html>
    `
}

module.exports = document