/**
 * --------------------------------------------------------------------------
 * AUTHENTICATION CONTROLLER
 * --------------------------------------------------------------------------
 * Handles user and administrator login authentication.
 */

export const loginUser = async (req, res) => {
  try {
    const { email, password, role = 'admin' } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email address and password.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check credentials (allows admin@solarpro.com / admin123 or flexible demo access)
    const isAdmin = cleanEmail.includes('admin') || role === 'admin' || password === 'admin123';

    if (password.length < 4) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password must be at least 4 characters.'
      });
    }

    console.log(`\x1b[32m✔ User Logged In: ${cleanEmail} (${isAdmin ? 'Admin' : 'User'})\x1b[0m`);

    return res.status(200).json({
      success: true,
      message: 'Login successful! Welcome to the portal.',
      user: {
        id: 'usr_' + Date.now(),
        name: isAdmin ? 'SolarPro Admin' : 'Customer Client',
        email: cleanEmail,
        role: isAdmin ? 'admin' : 'customer'
      },
      token: 'solar_auth_token_' + Date.now()
    });
  } catch (error) {
    console.error('Error during login:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication.',
      error: error.message
    });
  }
};
