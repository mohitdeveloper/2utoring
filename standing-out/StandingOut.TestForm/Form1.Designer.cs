namespace StandingOut.TestForm
{
    partial class Form1
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.numberOfCodes = new System.Windows.Forms.TextBox();
            this.numberOfUses = new System.Windows.Forms.TextBox();
            this.amountOff = new System.Windows.Forms.TextBox();
            this.codeLength = new System.Windows.Forms.TextBox();
            this.btnGeneratePromo = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // numberOfCodes
            // 
            this.numberOfCodes.Location = new System.Drawing.Point(12, 12);
            this.numberOfCodes.Name = "numberOfCodes";
            this.numberOfCodes.PlaceholderText = "Number of Codes";
            this.numberOfCodes.Size = new System.Drawing.Size(138, 23);
            this.numberOfCodes.TabIndex = 0;
            // 
            // numberOfUses
            // 
            this.numberOfUses.Location = new System.Drawing.Point(310, 12);
            this.numberOfUses.Name = "numberOfUses";
            this.numberOfUses.PlaceholderText = "Number of Uses";
            this.numberOfUses.Size = new System.Drawing.Size(138, 23);
            this.numberOfUses.TabIndex = 0;
            // 
            // amountOff
            // 
            this.amountOff.Location = new System.Drawing.Point(156, 12);
            this.amountOff.Name = "amountOff";
            this.amountOff.PlaceholderText = "Amount Off (Percentage)";
            this.amountOff.Size = new System.Drawing.Size(148, 23);
            this.amountOff.TabIndex = 0;
            // 
            // codeLength
            // 
            this.codeLength.Location = new System.Drawing.Point(454, 12);
            this.codeLength.Name = "codeLength";
            this.codeLength.PlaceholderText = "Code Length";
            this.codeLength.Size = new System.Drawing.Size(138, 23);
            this.codeLength.TabIndex = 0;
            // 
            // btnGeneratePromo
            // 
            this.btnGeneratePromo.Location = new System.Drawing.Point(615, 12);
            this.btnGeneratePromo.Name = "btnGeneratePromo";
            this.btnGeneratePromo.Size = new System.Drawing.Size(75, 23);
            this.btnGeneratePromo.TabIndex = 1;
            this.btnGeneratePromo.Text = "Generate";
            this.btnGeneratePromo.UseVisualStyleBackColor = true;
            this.btnGeneratePromo.Click += new System.EventHandler(this.btnGeneratePromo_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.btnGeneratePromo);
            this.Controls.Add(this.codeLength);
            this.Controls.Add(this.amountOff);
            this.Controls.Add(this.numberOfUses);
            this.Controls.Add(this.numberOfCodes);
            this.Name = "Form1";
            this.Text = "Form1";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox numberOfCodes;
        private System.Windows.Forms.TextBox numberOfUses;
        private System.Windows.Forms.TextBox amountOff;
        private System.Windows.Forms.TextBox codeLength;
        private System.Windows.Forms.Button btnGeneratePromo;
    }
}

