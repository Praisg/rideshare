import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../errors/index.js';
import { runAgent, autoProcessKyc } from '../services/aiAgent.js';

export const chatWithAgent = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    throw new BadRequestError('Message is required');
  }

  try {
    const result = await runAgent(message);

    res.status(StatusCodes.OK).json({
      success: true,
      response: result.response,
    });
  } catch (error) {
    console.error('Agent error:', error);
    throw new BadRequestError('Failed to process agent request');
  }
};

export const initAgent = async (req, res) => {
  // Agent is always ready with new SDK
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Agent is ready',
  });
};

export const autoKycProcessing = async (req, res) => {
  try {
    const result = await autoProcessKyc();

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Auto KYC processing completed',
      result,
    });
  } catch (error) {
    console.error('Auto KYC error:', error);
    throw new BadRequestError('Failed to auto-process KYC');
  }
};

export const getAgentSuggestions = async (req, res) => {
  try {
    const result = await runAgent(
      'Analyze current platform state and provide 3-5 actionable suggestions for improving operations, revenue, or user experience.'
    );

    res.status(StatusCodes.OK).json({
      success: true,
      suggestions: result.response,
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    throw new BadRequestError('Failed to get suggestions');
  }
};

