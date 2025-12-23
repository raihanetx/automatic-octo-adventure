import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function main() {
  // Create initial admin user
  const adminUsername = 'admin';
  const adminPassword = 'admin123'; // Change this in production!

  const existingAdmin = await prisma.admin.findUnique({
    where: { username: adminUsername },
  });

  if (existingAdmin) {
    console.log('Admin user already exists:', adminUsername);
  } else {
    const hashedPassword = await hashPassword(adminPassword);
    const admin = await prisma.admin.create({
      data: {
        username: adminUsername,
        password: hashedPassword,
      },
    });
    console.log('Admin user created:', adminUsername);
  }

  // Create some sample articles
  const sampleArticles = [
    {
      title: 'Getting Started with Modern Web Development',
      slug: 'getting-started-with-modern-web-development',
      content: `# Getting Started with Modern Web Development

Welcome to the world of modern web development! In this article, we'll explore the key technologies and practices that are shaping the future of web development.

## Why Modern Web Development Matters

Modern web development focuses on creating fast, responsive, and user-friendly applications that work seamlessly across all devices. With the rise of mobile usage and the increasing expectations of users, it's more important than ever to stay up-to-date with the latest tools and techniques.

## Key Technologies to Learn

1. **Next.js** - A powerful React framework for building server-rendered applications
2. **TypeScript** - Adding type safety to your JavaScript code
3. **Tailwind CSS** - Utility-first CSS framework for rapid UI development
4. **Prisma** - Modern database toolkit with type-safe queries

## Best Practices

- Write clean, maintainable code
- Test your applications thoroughly
- Optimize for performance
- Follow accessibility guidelines
- Keep security in mind

## Conclusion

Modern web development is an exciting field that's constantly evolving. By staying curious and continuously learning, you can build amazing applications that users love.`,
      excerpt: 'Explore the key technologies and best practices in modern web development including Next.js, TypeScript, and more.',
      published: true,
    },
    {
      title: 'Understanding Database Design Principles',
      slug: 'understanding-database-design-principles',
      content: `# Understanding Database Design Principles

A well-designed database is the foundation of any successful application. Let's dive into the essential principles of database design.

## Normalization

Normalization is the process of organizing data to reduce redundancy and improve data integrity. There are several normal forms, each with specific rules:

- **First Normal Form (1NF)**: Eliminate repeating groups
- **Second Normal Form (2NF)**: Remove partial dependencies
- **Third Normal Form (3NF)**: Remove transitive dependencies

## Relationships

Understanding how different entities relate to each other is crucial:

- **One-to-One**: Each record in table A relates to one record in table B
- **One-to-Many**: One record in table A relates to many records in table B
- **Many-to-Many**: Many records in table A relate to many records in table B

## Indexing

Indexes dramatically improve query performance by allowing the database to find data quickly. However, they come with a cost - slower writes and increased storage.

## Conclusion

Good database design is about finding the right balance between normalization, performance, and maintainability.`,
      excerpt: 'Learn the fundamental principles of database design including normalization, relationships, and indexing.',
      published: true,
    },
    {
      title: 'Building Secure Authentication Systems',
      slug: 'building-secure-authentication-systems',
      content: `# Building Secure Authentication Systems

Authentication is a critical component of any application that handles user data. Let's explore how to build a secure authentication system.

## Password Hashing

Never store passwords in plain text! Always use a strong hashing algorithm like bcrypt:

\`\`\`javascript
import bcrypt from 'bcryptjs';

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};
\`\`\`

## JSON Web Tokens (JWT)

JWTs are a stateless way to handle authentication:

1. User logs in with credentials
2. Server verifies credentials and generates a JWT
3. Client stores the JWT and sends it with subsequent requests
4. Server validates the JWT on each request

## Security Best Practices

- Use HTTPS everywhere
- Implement rate limiting
- Never log sensitive information
- Keep dependencies updated
- Use environment variables for secrets
- Implement proper error handling

## Conclusion

Building secure authentication requires attention to detail and following established best practices.`,
      excerpt: 'Discover how to implement secure authentication using password hashing and JWT tokens.',
      published: true,
    },
  ];

  // Get the admin user
  const admin = await prisma.admin.findUnique({
    where: { username: adminUsername },
  });

  if (!admin) {
    console.log('Admin user not found. Please run the seed script again.');
    return;
  }

  // Create sample articles
  for (const articleData of sampleArticles) {
    const existingArticle = await prisma.article.findUnique({
      where: { slug: articleData.slug },
    });

    if (!existingArticle) {
      const article = await prisma.article.create({
        data: {
          ...articleData,
          authorId: admin.id,
        },
      });
      console.log('Article created:', article.title);
    } else {
      console.log('Article already exists:', articleData.title);
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
