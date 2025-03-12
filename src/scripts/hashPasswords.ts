import pool from '../config/dbconfig';
import * as bcrypt from 'bcrypt';

const updatePasswords = async () => {
    try {
        // Retrieve all employees
        const [rows]: any = await pool.query('SELECT employeMail, employeMDP FROM employe');

        // Prepare an array of promises
        const updatePromises = rows.map(async (employe: any) => {
            const { employeMail, employeMDP } = employe;

            // Skip if the password is already hashed
            if (employeMDP.startsWith('$2b$')) {
                console.log(`✅ Password already hashed for ${employeMail}, skipping.`);
                return null;
            }

            // Hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(employeMDP, saltRounds);

            // Update the database
            await pool.query('UPDATE employe SET employeMDP = ? WHERE employeMail = ?', [hashedPassword, employeMail]);
            
            console.log(`🔄 Password updated for ${employeMail}`);
        });

        // Execute all updates in parallel
        await Promise.all(updatePromises);

        console.log('✅ All passwords have been updated successfully.');
        process.exit(); // Exit the script cleanly
    } catch (error) {
        console.error('❌ Error updating passwords:', error);
        process.exit(1);
    }
};

// Run the script
updatePasswords();
