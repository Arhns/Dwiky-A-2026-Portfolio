// Original thumbnail compositions from the companion editorial portfolio.
const editorialCoverSlugs={0:'pina-main',1:'pina-trade',2:'bananas-main',3:'bananas-driver',4:'bananas-intools',5:'tokopedia-pdp',6:'tokopedia-shop',7:'tokopedia-os',8:'logo',100:'elara-health',101:'service-metrics',102:'online-ce-credits',9:'alien-dc',10:'map-club',11:'listerine',12:'yo-panino',13:'newwman-hotel',14:'garuda'};
for(const project of window.PROJECTS){const slug=editorialCoverSlugs[project.id];if(slug)project.cover=`assets/editorial-covers/${slug}.${project.category==='product'?'png':'jpg'}`}
