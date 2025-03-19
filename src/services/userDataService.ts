import axios from 'axios';
import { User, Article, RoutineCompletion, Badge, Challenge } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// User data functions
export const getUserProfile = async (): Promise<User> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
};

// Alias for getUserProfile for backward compatibility
export const getUserData = getUserProfile;

export const updateUserProfile = async (userData: Partial<User>): Promise<User> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/users/profile`, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
};

// Alias for updateUserProfile for backward compatibility
export const updateUserData = updateUserProfile;

// Skills and progression
export const getUserSkills = async (): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/users/skills`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data.skills;
  } catch (error) {
    console.error('Error fetching user skills:', error);
    throw new Error('Failed to fetch user skills');
  }
};

export const getUserBadges = async (): Promise<Badge[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/users/badges`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data.badges;
  } catch (error) {
    console.error('Error fetching user badges:', error);
    throw new Error('Failed to fetch user badges');
  }
};

// Challenges
export const getUserChallenges = async (): Promise<Challenge[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/challenges/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data.challenges;
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    throw new Error('Failed to fetch user challenges');
  }
};

export const completeChallenge = async (challengeId: string): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/challenges/complete`, 
      { challengeId },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error completing challenge:', error);
    throw new Error('Failed to complete challenge');
  }
};

// Articles
export const getArticles = async (category?: string): Promise<Article[]> => {
  try {
    let url = `${API_URL}/articles`;
    if (category) {
      url += `?category=${category}`;
    }
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw new Error('Failed to fetch articles');
  }
};

export const getArticleById = async (id: string): Promise<Article> => {
  try {
    const response = await axios.get(`${API_URL}/articles/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching article ${id}:`, error);
    throw new Error('Failed to fetch article');
  }
};

export const saveArticle = async (articleId: string): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/users/articles/save`,
      { articleId },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error saving article:', error);
    throw new Error('Failed to save article');
  }
};

export const unsaveArticle = async (articleId: string): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/users/articles/unsave`,
      { articleId },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error removing saved article:', error);
    throw new Error('Failed to remove article from saved list');
  }
};

export const getSavedArticles = async (): Promise<Article[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/users/articles/saved`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data.articles;
  } catch (error) {
    console.error('Error fetching saved articles:', error);
    throw new Error('Failed to fetch saved articles');
  }
};

// Routines
export const completeRoutine = async (routineId: string, notes?: string): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/users/routines/complete`,
      { 
        routineId,
        notes,
        date: new Date()
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error completing routine:', error);
    throw new Error('Failed to mark routine as completed');
  }
};

export const getRoutineHistory = async (): Promise<RoutineCompletion[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/users/routines/history`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data.history;
  } catch (error) {
    console.error('Error fetching routine history:', error);
    throw new Error('Failed to fetch routine history');
  }
};

export const getRoutineStreak = async (): Promise<number> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/users/routines/streak`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data.streak;
  } catch (error) {
    console.error('Error fetching routine streak:', error);
    throw new Error('Failed to fetch routine streak');
  }
};

// Mock data service for development
export const MOCK_ARTICLES = [
  {
    id: 'mindset-confidence',
    title: 'Développer une Confiance Inébranlable en Séduction',
    author: 'Alexandre Cormont',
    publishDate: new Date('2023-05-15'),
    category: 'mindset',
    tags: ['confiance', 'psychologie', 'développement personnel'],
    readTime: 12,
    premiumOnly: false,
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1748&q=80',
    summary: 'La confiance en soi est le fondement de toute réussite en séduction. Cet article explore les mécanismes psychologiques de la confiance et propose des techniques concrètes pour la développer durablement.',
    sections: [
      {
        id: 'section-1',
        title: 'Les fondements psychologiques de la confiance',
        content: `
          <p>La confiance en soi n'est pas innée, elle se construit. La psychologie moderne nous enseigne que la confiance repose sur trois piliers fondamentaux :</p>
          
          <ul>
            <li><strong>L'estime de soi</strong> - La valeur que vous vous accordez indépendamment du regard des autres</li>
            <li><strong>L'auto-efficacité</strong> - Votre croyance en votre capacité à accomplir des tâches et atteindre vos objectifs</li>
            <li><strong>L'image de soi</strong> - La façon dont vous vous percevez et vous définissez</li>
          </ul>
          
          <p>Ces trois éléments s'influencent mutuellement et forment un système dynamique qui détermine votre niveau de confiance dans différents contextes sociaux. Pour développer une confiance authentique en séduction, vous devez travailler sur ces trois aspects simultanément.</p>
          
          <p>La neuroplasticité, cette capacité du cerveau à se reconfigurer, nous permet de modifier nos schémas de pensée liés à la confiance. Chaque fois que vous affrontez une situation sociale avec courage, votre cerveau crée de nouvelles connexions neuronales qui renforcent votre sentiment d'auto-efficacité.</p>
        `
      },
      {
        id: 'section-2',
        title: 'Le paradoxe de la vulnérabilité',
        content: `
          <p>Contrairement aux idées reçues, la véritable confiance ne consiste pas à dissimuler ses faiblesses, mais à les accepter. Les recherches du Dr. Brené Brown ont démontré que la vulnérabilité est le chemin vers une connexion authentique avec les autres.</p>
          
          <p>En séduction, cela se traduit par :</p>
          
          <ul>
            <li>La capacité à exprimer vos intentions sans crainte du rejet</li>
            <li>L'authenticité dans vos interactions, sans masque social</li>
            <li>La résilience face aux échecs, qui deviennent des opportunités d'apprentissage</li>
          </ul>
          
          <p>L'exercice du "rejet volontaire" illustre parfaitement ce principe : en vous exposant délibérément à de petits rejets quotidiens, vous désensibilisez votre cerveau à la peur du jugement social. Commencez par des demandes simples comme négocier une réduction dans un magasin ou engager une conversation avec un inconnu.</p>
          
          <p>Au fil du temps, ces petites victoires sur vous-même construisent une confiance robuste qui résiste aux échecs inévitables du parcours de séduction.</p>
        `
      },
      {
        id: 'section-3',
        title: 'Techniques pratiques de renforcement',
        content: `
          <p>Au-delà de la compréhension théorique, voici des exercices concrets à pratiquer quotidiennement :</p>
          
          <h3>1. L'ancrage corporel</h3>
          <p>Votre posture influence directement votre état mental. Adoptez la "posture de pouvoir" pendant 2 minutes chaque matin : tenez-vous debout, jambes légèrement écartées, mains sur les hanches, menton relevé. Cette position augmente la testostérone et réduit le cort          isel de 20%, comme l'ont démontré les recherches d'Amy Cuddy de Harvard.</p>
          
          <h3>2. La désensibilisation systématique</h3>
          <p>Créez une hiérarchie d'anxiété en matière de séduction, en classant les situations du moins au plus intimidant. Commencez par affronter les situations les moins stressantes et progressez graduellement. Votre système nerveux s'adaptera progressivement, rendant confortables des situations auparavant intimidantes.</p>
          
          <h3>3. Le dialogue intérieur positif</h3>
          <p>Identifiez et remplacez vos monologues intérieurs négatifs par des affirmations réalistes et constructives. Par exemple, transformez "Je vais probablement me faire rejeter" en "Chaque interaction est une opportunité d'apprentissage, quelle que soit l'issue".</p>
          
          <p>Ces techniques, pratiquées avec constance, reconfigureront progressivement votre rapport à vous-même et aux autres dans le contexte de la séduction.</p>
        `
      },
      {
        id: 'section-4',
        title: 'Mesurer et célébrer vos progrès',
        content: `
          <p>La confiance se construit sur des preuves concrètes de votre évolution. Tenez un journal de vos interactions sociales en notant :</p>
          
          <ul>
            <li>Les situations qui vous intimidaient auparavant et que vous affrontez maintenant</li>
            <li>Les réactions positives inattendues que vous recevez</li>
            <li>Vos propres observations sur votre langage corporel et verbal</li>
          </ul>
          
          <p>Ce processus de documentation transforme des impressions subjectives en données objectives qui renforcent votre sentiment d'auto-efficacité. Célébrez chaque progrès, aussi minime soit-il, pour activer les circuits de récompense de votre cerveau et consolider ces nouveaux schémas de confiance.</p>
          
          <p>Rappelez-vous que la confiance authentique n'est pas l'absence de doute, mais la capacité à agir malgré lui. Comme l'a dit Aristote : "On devient courageux en accomplissant des actes de courage."</p>
        `
      }
    ],
    content: 'Contenu complet de l\'article sur la confiance...'
  },
  {
    id: 'pnl-communication',
    title: 'PNL en Séduction : Les patterns de communication qui créent l\'attraction',
    author: 'Julien Raby',
    publishDate: new Date('2023-06-20'),
    category: 'pnl',
    tags: ['pnl', 'communication', 'attraction', 'techniques'],
    readTime: 15,
    premiumOnly: true,
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    summary: 'La Programmation Neuro-Linguistique offre des outils puissants pour établir un rapport profond et créer une attraction naturelle. Découvrez comment les principes de la PNL peuvent transformer vos interactions romantiques.',
    sections: [
      {
        id: 'section-1',
        title: 'Qu\'est-ce que la PNL et pourquoi elle fonctionne en séduction',
        content: `
          <p>La Programmation Neuro-Linguistique (PNL) étudie comment notre langage, tant verbal que non-verbal, influence notre système nerveux et notre comportement. Développée dans les années 1970 par Richard Bandler et John Grinder, la PNL part du principe que nous percevons le monde à travers des filtres sensoriels (visuel, auditif, kinesthésique) qui façonnent notre expérience.</p>
          
          <p>En séduction, la PNL offre un cadre pour comprendre et influencer les mécanismes de l'attraction en agissant sur trois niveaux :</p>
          
          <ul>
            <li><strong>La communication verbale</strong> - Les mots et structures linguistiques que vous utilisez</li>
            <li><strong>La communication para-verbale</strong> - Votre ton, rythme, volume et qualité vocale</li>
            <li><strong>La communication non-verbale</strong> - Vos gestes, expressions faciales et posture</li>
          </ul>
          
          <p>L'efficacité de la PNL en séduction repose sur sa capacité à créer un sentiment de compréhension profonde et de connexion authentique, éléments fondamentaux de l'attraction interpersonnelle.</p>
        `
      },
      {
        id: 'section-2',
        title: 'Le mirroring et le matching : la synchronisation subtile',
        content: `
          <p>Le principe de synchronisation, ou "mirroring", est l'une des techniques les plus puissantes de la PNL en séduction. Il s'agit d'adopter subtilement certains aspects du comportement de votre interlocuteur pour établir un rapport inconscient.</p>
          
          <p>Cette synchronisation peut se faire à plusieurs niveaux :</p>
          
          <ul>
            <li><strong>Physique</strong> - Adopter une posture similaire, des gestes complémentaires</li>
            <li><strong>Vocal</strong> - Ajuster votre rythme, volume et tonalité pour compléter les siens</li>
            <li><strong>Respiratoire</strong> - Synchroniser votre respiration avec la sienne</li>
            <li><strong>Linguistique</strong> - Utiliser des structures de phrases et un vocabulaire similaires</li>
          </ul>
          
          <p>Des études en neurosciences ont confirmé l'efficacité de cette technique grâce à la découverte des "neurones miroirs", qui s'activent aussi bien lorsque nous exécutons une action que lorsque nous observons quelqu'un d'autre l'exécuter.</p>
          
          <p>Important : Le mirroring doit rester subtil et naturel. Une imitation trop évidente ou mécanique produira l'effet inverse et sera perçue comme manipulatoire.</p>
        `
      },
      {
        id: 'section-3',
        title: 'Le calibrage et l\'identification des systèmes de représentation',
        content: `
          <p>Selon la PNL, chaque personne a un système de représentation préférentiel (visuel, auditif ou kinesthésique) qui influence sa façon de percevoir et d'exprimer le monde. Identifier et s'adapter au système dominant de votre interlocuteur crée une connexion profonde.</p>
          
          <h3>Comment identifier les systèmes de représentation :</h3>
          
          <ul>
            <li><strong>Visuel</strong> - "Je vois ce que tu veux dire", mouvements oculaires vers le haut, rythme rapide, posture droite</li>
            <li><strong>Auditif</strong> - "Ça me parle", mouvements oculaires latéraux, voix mélodieuse, tête inclinée</li>
            <li><strong>Kinesthésique</strong> - "Je sens que c'est juste", mouvements oculaires vers le bas, rythme lent, posture détendue</li>
          </ul>
          
          <p>Une fois le système dominant identifié, adaptez votre langage en conséquence :</p>
          
          <ul>
            <li>Pour une personne visuelle : "J'aimerais te montrer un endroit qui offre une vue magnifique sur la ville"</li>
            <li>Pour une personne auditive : "Ce concert résonne encore en moi, la musique était envoûtante"</li>
            <li>Pour une personne kinesthésique : "Ce restaurant a une ambiance chaleureuse et des saveurs qui te touchent"</li>
          </ul>
          
          <p>Cette adaptation crée un sentiment immédiat de compréhension et de connexion, comme si vous parliez la même langue intérieure.</p>
        `
      },
      {
        id: 'section-4',
        title: 'L\'ancrage émotionnel : créer des associations positives',
        content: `
          <p>L'ancrage est une technique qui associe un stimulus spécifique (un toucher, un mot, un geste) à un état émotionnel particulier. En séduction, cette technique permet de créer des associations positives durables entre votre présence et des sensations agréables.</p>
          
          <p>Pour créer un ancrage efficace :</p>
          
          <ol>
            <li>Identifiez un moment où votre interlocuteur est dans un état émotionnel positif et intense (rire, émerveillement, excitation)</li>
            <li>Introduisez discrètement un stimulus unique - comme un toucher léger sur l'avant-bras ou une expression verbale distinctive</li>
            <li>Répétez cette association à plusieurs reprises lors de différents pics émotionnels positifs</li>
            <li>Utilisez ensuite l'ancre pour réactiver cet état émotionnel positif</li>
          </ol>
          
          <p>Par exemple, si vous touchez légèrement l'épaule de votre interlocuteur chaque fois qu'il rit aux éclats, après plusieurs répétitions, un simple toucher similaire pourra évoquer un sentiment positif, même dans un contexte différent.</p>
          
          <p>Cette technique repose sur le conditionnement pavlovien et doit être utilisée avec éthique, dans l'objectif d'enrichir l'interaction plutôt que de manipuler.</p>
        `
      }
    ],
    content: 'Contenu complet de l\'article sur la PNL...'
  },
  {
    id: 'neurosciences-attraction',
    title: 'Les Neurosciences de l\'Attraction : Ce qui se passe dans le cerveau quand on séduit',
    author: 'Dr. Marie Laurent',
    publishDate: new Date('2023-07-05'),
    category: 'neurosciences',
    tags: ['neurosciences', 'attraction', 'dopamine', 'science'],
    readTime: 18,
    premiumOnly: false,
    imageUrl: 'https://images.unsplash.com/photo-1559757175-7cb05f7e573c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80',
    summary: 'Les avancées récentes en neurosciences nous permettent de comprendre les mécanismes cérébraux qui sous-tendent l\'attraction et la séduction. Découvrez comment votre cerveau orchestre la danse de l\'amour.',
    sections: [
      {
        id: 'section-1',
        title: 'Le cerveau tripartite et son rôle dans la séduction',
        content: `
          <p>Notre cerveau, produit de millions d'années d'évolution, peut être divisé en trois parties principales qui jouent chacune un rôle distinct dans les mécanismes d'attraction :</p>
          
          <ul>
            <li><strong>Le cerveau reptilien</strong> (tronc cérébral) - Responsable des instincts de survie et de reproduction, il évalue rapidement et inconsciemment les indices de fertilité et de santé chez les partenaires potentiels.</li>
            <li><strong>Le cerveau limbique</strong> - Siège des émotions et de la mémoire émotionnelle, il génère les sensations d'attirance, de plaisir et d'attachement.</li>
            <li><strong>Le néocortex</strong> - Notre partie rationnelle qui analyse la compatibilité, les valeurs partagées et projette les relations dans le futur.</li>
          </ul>
          
          <p>Ces trois niveaux interagissent constamment, parfois en harmonie, parfois en conflit. Comprendre cette structure tripartite explique pourquoi nous pouvons être attirés par quelqu'un tout en sachant rationnellement que cette personne ne nous convient pas.</p>
          
          <p>En séduction efficace, vous devez engager ces trois niveaux cérébraux chez votre interlocuteur : stimuler le reptilien par votre présence physique, toucher le limbique par les émotions que vous éveillez, et convaincre le néocortex par une connexion intellectuelle et des valeurs partagées.</p>
        `
      },
      {
        id: 'section-2',
        title: 'La chimie de l\'attraction : les neurotransmetteurs en action',
        content: `
          <p>L'attraction amoureuse est littéralement une question de chimie. Plusieurs neurotransmetteurs et hormones orchestrent ce que nous ressentons comme de l'attirance :</p>
          
          <h3>Dopamine : le neurotransmetteur du désir</h3>
          <p>Souvent appelée "molécule du plaisir", la dopamine est libérée lorsque nous anticipons une récompense. Dans le contexte de la séduction, les niveaux de dopamine augmentent significativement lorsque nous rencontrons quelqu'un qui nous attire, créant cette sensation d'excitation et de motivation à poursuivre l'interaction.</p>
          
          <p>Fait intéressant : les études d'IRM fonctionnelle montrent que les mêmes circuits cérébraux de récompense s'activent lors d'une attraction romantique intense et lors de la consommation de drogues stimulantes, expliquant l'aspect "addictif" des premiers stades de l'attirance.</p>
          
          <h3>Noradrénaline : l'éveil et la vigilance</h3>
          <p>Cette hormone augmente la fréquence cardiaque, dilate les pupilles et accroît l'attention. C'est elle qui est responsable des "papillons dans l'estomac" et de cette hyperconscience que nous ressentons en présence de quelqu'un qui nous attire.</p>
          
          <h3>Sérotonine : le régulateur d'humeur</h3>
          <p>Curieusement, les niveaux de sérotonine diminuent durant les premières phases de l'attraction, un profil similaire à celui observé dans les troubles obsessionnels compulsifs. Cela explique pourquoi les personnes amoureuses peuvent avoir des pensées obsessionnelles concernant l'objet de leur affection.</p>
          
          <h3>Ocytocine et Vasopressine : les liens d'attachement</h3>
          <p>Ces hormones, libérées principalement pendant les contacts physiques et les rapports sexuels, favorisent l'attachement et la fidélité. Elles transforment progressivement l'attraction initiale en lien émotionnel durable.</p>
          
          <p>La connaissance de ces mécanismes vous permet d'influencer consciemment la chimie cérébrale : créer des situations de nouveauté et d'excitation stimule la dopamine, le contact visuel prolongé et les touches légères favorisent la libération d'ocytocine.</p>
        `
      },
      {
        id: 'section-3',
        title: 'Les marqueurs biologiques de l\'attirance',
        content: `
          <p>Notre cerveau est constamment à la recherche de signaux biologiques d'attirance, souvent de manière totalement inconsciente. Ces marqueurs ont une base évolutive puissante :</p>
          
          <h3>Symétrie faciale et corporelle</h3>
          <p>La symétrie est un indicateur de stabilité génétique et de bonne santé durant le développement. Des études ont montré que les visages et corps plus symétriques sont universellement perçus comme plus attractifs, indépendamment des différences culturelles.</p>
          
          <h3>Ratio taille-hanches et signaux de fertilité</h3>
          <p>Le cerveau masculin réagit particulièrement au ratio taille-hanches d'environ 0,7 chez les femmes, un indicateur de fertilité optimale. De même, les femmes sont inconsciemment attirées par des indices de niveaux élevés de testostérone chez les hommes (mâchoire prononcée, carrure large).</p>
          
          <h3>Odeurs et compatibilité immunitaire</h3>
          <p>Le complexe majeur d'histocompatibilité (CMH), partie de notre système immunitaire, influence notre attirance via les phéromones. Nous sommes naturellement attirés par les personnes dont le profil CMH est complémentaire au nôtre, ce qui favoriserait la production d'enfants avec des systèmes immunitaires robustes.</p>
          
          <p>Ces mécanismes expliquent pourquoi l'attraction initiale peut sembler irrationnelle - elle est guidée par des processus biologiques profonds destinés à maximiser nos chances de reproduction réussie.</p>
          
          <p>Bien que ces aspects biologiques soient importants, rassurez-vous : la séduction humaine va bien au-delà de ces facteurs primitifs. Notre néocortex développé nous permet d'être attirés par l'intelligence, l'humour, la gentillesse et d'autres qualités non directement liées à la reproduction.</p>
        `
      },
      {
        id: 'section-4',
        title: 'Appliquer les neurosciences à vos interactions',
        content: `
          <p>Comment transformer ces connaissances scientifiques en stratégies pratiques pour améliorer vos interactions de séduction ?</p>
          
          <h3>Créer des pics dopaminergiques</h3>
          <p>La dopamine est libérée lors d'expériences nouvelles, excitantes et imprévisibles. Proposez des activités originales plutôt que le classique "café". L'alternance entre moments de tension et de détente crée également des libérations cycliques de dopamine qui renforcent l'attraction.</p>
          
          <h3>Stimuler la production d'ocytocine</h3>
          <p>Favorisez les contacts visuels prolongés et, lorsque approprié, des touches légères sur les zones non-intimes (avant-bras, épaules, dos). Des études ont montré qu'un contact de 20 secondes peut significativement augmenter les niveaux d'ocytocine.</p>
          
          <h3>Exploiter le phénomène de "misattribution d'excitation"</h3>
          <p>Ce phénomène psychologique, bien documenté, montre que l'excitation physiologique (rythme cardiaque élevé, respiration accélérée) générée dans un contexte peut être inconsciemment attribuée à une personne présente. Les activités légèrement adrénaliniques (manèges, films d'horreur, sports) peuvent ainsi amplifier l'attraction ressentie.</p>
          
          <h3>Engager le néocortex par la vulnérabilité calibrée</h3>
          <p>Le partage progressif d'informations personnelles stimule l'intimité au niveau cortical. La "vulnérabilité calibrée" consiste à révéler des aspects authentiques de vous-même de manière progressive, créant ainsi un sentiment de connexion profonde et de confiance mutuelle.</p>
          
          <p>Ces approches basées sur les neurosciences ne sont pas des "techniques" manipulatoires, mais plutôt des moyens d'aligner vos interactions avec le fonctionnement naturel du cerveau humain. L'objectif reste de créer des connexions authentiques, simplement optimisées par la compréhension des mécanismes neurologiques sous-jacents.</p>
        `
      }
    ],
    content: 'Contenu complet de l\'article sur les neurosciences...'
  }
];

// Créer un objet de service qui regroupe toutes les fonctions
const userDataService = {
  getUserProfile,
  updateUserProfile,
  getUserSkills,
  getUserBadges,
  getUserChallenges,
  completeChallenge,
  getArticles,
  getArticleById,
  saveArticle,
  unsaveArticle,
  getSavedArticles,
  completeRoutine,
  getRoutineHistory,
  getRoutineStreak,
  getUserData,
  updateUserData,
  MOCK_ARTICLES
};

// Exporter l'objet de service comme export par défaut
export default userDataService;
