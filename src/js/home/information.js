async function sendUserDataToRenderer(userData, homeWin) {
  if (homeWin) {
    const script = `
      const userData = ${JSON.stringify(userData)};
      
      const username = userData.username || '-';
      const companies = userData.companies || [];
      const totalProjects = companies.reduce(
        (acc, company) => acc + (company.projects?.length || 0),
        0
      );
      const totalTime = companies.reduce((acc, company) => {
        return (
          acc +
          (company.projects || []).reduce(
            (projectAcc, project) =>
              projectAcc +
              (project.timeEntries || []).reduce(
                (entryAcc, entry) => entryAcc + (entry.hours || 0),
                0
              ),
            0
          )
        );
      }, 0);

      const headerCompanyElement = document.querySelector('.header span:nth-child(2)');
      const companyName = companies[0]?.companyName || '-';
      const companyImageUrl = companies[0]?.imageUrl || '';

      headerCompanyElement.innerHTML = '';

      if (companyImageUrl) {
        const img = document.createElement('img');
        img.src = companyImageUrl;
        img.alt = companyName;
        img.style.maxWidth = '50px';
        img.style.maxHeight = '50px';
        img.style.marginRight = '10px';
        img.style.objectFit = 'contain';
        headerCompanyElement.appendChild(img);
      }

      const textNode = document.createTextNode(companyName);
      headerCompanyElement.appendChild(textNode);

      document.querySelector('.header span:nth-child(3)').textContent = totalTime > 0 ? \`Wöchentliche Arbeitsstunden: \${totalTime}\` : 'Wöchentliche Arbeitsstunden: 0';
      document.querySelector('.active-orders p:nth-child(2)').textContent = totalProjects > 0 ? \`\${totalProjects}\` : '0';
      document.querySelector('.reports p:nth-child(2)').textContent = totalProjects > 0 ? 'Berichte verfügbar' : '0';
      document.querySelector('.employee-data p:nth-child(2)').textContent = username;
    `;

    try {
      await homeWin.webContents.executeJavaScript(script);
    } catch (error) {
      console.error('Error während dem ausführen von js im renderer:', error);
    }
  }
}

export { sendUserDataToRenderer };
