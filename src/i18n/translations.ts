import { Translation } from "./types";

export const translations: Record<string, Translation> = {
  en: {
    navigation: {
      dashboard: "Dashboard",
      userManagement: "User Management",
      emailConfiguration: "Email Configuration",
      userSearch: "User Search",
      settings: "Settings",
      myProjects: "My Projects",
      students: "Students",
      reviews: "Reviews",
      myProject: "My Project",
      tasks: "Tasks",
      documents: "Documents",
      projects: "Projects",
      proposals: "Proposals",
      interns: "Interns",
    },
    login: {
      title: "Sign in to PFE Platform",
      emailLabel: "Email address",
      emailPlaceholder: "Enter your email",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      signIn: "Sign in",
      signingIn: "Signing in...",
      demoAccounts: "Demo Accounts",
      demoPassword: 'Use password: "password" for all demo accounts',
      adminDemo: "Admin Demo",
      teacherDemo: "Teacher Demo",
      studentDemo: "Student Demo",
      companyDemo: "Company Demo",
    },
    profile: {
      profileSettings: "Profile Settings",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      cancel: "Cancel",
      saveChanges: "Save Changes",
      editProfile: "Edit Profile",
      changePassword: "Change Password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm New Password",
      updatePassword: "Update Password",
      passwordsNotMatch: "New passwords do not match",
      imageSizeError: "Image must be less than 5MB",
      imageTypeError: "File must be an image",
      language: "Language",
      english: "English",
      french: "French",
    },
  },
  fr: {
    navigation: {
      dashboard: "Tableau de bord",
      userManagement: "Gestion des utilisateurs",
      emailConfiguration: "Configuration des emails",
      userSearch: "Recherche d'utilisateurs",
      settings: "Paramètres",
      myProjects: "Mes projets",
      students: "Étudiants",
      reviews: "Évaluations",
      myProject: "Mon projet",
      tasks: "Tâches",
      documents: "Documents",
      projects: "Projets",
      proposals: "Propositions",
      interns: "Stagiaires",
    },
    login: {
      title: "Connexion à PFE Platform",
      emailLabel: "Adresse email",
      emailPlaceholder: "Entrez votre email",
      passwordLabel: "Mot de passe",
      passwordPlaceholder: "Entrez votre mot de passe",
      signIn: "Se connecter",
      signingIn: "Connexion...",
      demoAccounts: "Comptes de démonstration",
      demoPassword:
        'Utilisez le mot de passe: "password" pour tous les comptes',
      adminDemo: "Démo Admin",
      teacherDemo: "Démo Enseignant",
      studentDemo: "Démo Étudiant",
      companyDemo: "Démo Entreprise",
    },
    profile: {
      profileSettings: "Paramètres du Profil",
      firstName: "Prénom",
      lastName: "Nom",
      email: "E-mail",
      cancel: "Annuler",
      saveChanges: "Enregistrer",
      editProfile: "Modifier le Profil",
      changePassword: "Changer le Mot de Passe",
      currentPassword: "Mot de Passe Actuel",
      newPassword: "Nouveau Mot de Passe",
      confirmPassword: "Confirmer le Mot de Passe",
      updatePassword: "Mettre à jour",
      passwordsNotMatch: "Les mots de passe ne correspondent pas",
      imageSizeError: "L'image doit être inférieure à 5 Mo",
      imageTypeError: "Le fichier doit être une image",
      language: "Langue",
      english: "Anglais",
      french: "Français",
    },
  },
};
